import React from 'react';
import type { BlockEditProps, BlockSchemaProps } from '@plone/types';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import config from '@plone/volto/registry';
import { useIntl } from 'react-intl';
import { VideoBlockSchema } from './schema';
import type { VideoBlockData } from './index';

export interface VideoBlockDataProps
  extends Partial<
    Pick<
      BlockEditProps,
      'blocksConfig' | 'blocksErrors' | 'contentType' | 'navRoot'
    >
  > {
  data: VideoBlockData & { '@type'?: string };
  block: string;
  onChangeBlock: (id: string, data: VideoBlockData) => void;
  [key: string]: any;
}

const VideoBlockDataForm: React.FC<VideoBlockDataProps> = (props) => {
  const {
    data,
    block,
    blocksConfig = config.blocks.blocksConfig,
    blocksErrors,
    contentType,
    navRoot,
    onChangeBlock,
  } = props;
  const intl = useIntl();
  // `@plone/types` declares `IntlShape['messages']` more narrowly than the
  // `react-intl` Volto ships. Cast until that is fixed upstream.
  const schemaIntl = intl as BlockSchemaProps['intl'];
  const blockSchema =
    blocksConfig?.[data['@type'] as string]?.blockSchema ?? VideoBlockSchema;
  const schema =
    typeof blockSchema === 'function'
      ? blockSchema({ ...props, intl: schemaIntl })
      : blockSchema;

  const handleFieldChange = (id: string, value: any) => {
    if (id === 'href' && Array.isArray(value) && value[0]) {
      const item = value[0];
      onChangeBlock(block, {
        ...data,
        href: value,
        title: data.title || item.Title || '',
        description: data.description || item.Description || '',
      });
      return;
    }
    onChangeBlock(block, {
      ...data,
      [id]: value,
    });
  };

  return (
    <BlockDataForm
      schema={schema}
      title={schema.title}
      onChangeField={handleFieldChange}
      onChangeBlock={onChangeBlock}
      formData={data}
      block={block}
      navRoot={navRoot}
      contentType={contentType}
      errors={blocksErrors}
    />
  );
};

export default VideoBlockDataForm;
