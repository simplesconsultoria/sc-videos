import React from 'react';
import type { BlockEditProps, BlockSchemaProps } from '@plone/types';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import config from '@plone/volto/registry';
import { useIntl } from 'react-intl';
import { VideoPlayerSchema } from './schema';
import type { VideoPlayerBlockData } from './index';

export interface VideoPlayerBlockDataProps
  extends Partial<
    Pick<
      BlockEditProps,
      'blocksConfig' | 'blocksErrors' | 'contentType' | 'navRoot'
    >
  > {
  data: VideoPlayerBlockData & { '@type'?: string };
  block: string;
  onChangeBlock: (id: string, data: VideoPlayerBlockData) => void;
  [key: string]: any;
}

const VideoPlayerBlockDataForm: React.FC<VideoPlayerBlockDataProps> = (
  props,
) => {
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
    blocksConfig?.[data['@type'] as string]?.blockSchema ?? VideoPlayerSchema;
  const schema =
    typeof blockSchema === 'function'
      ? blockSchema({ ...props, intl: schemaIntl })
      : blockSchema;

  const handleFieldChange = (id: string, value: any) => {
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

export default VideoPlayerBlockDataForm;
