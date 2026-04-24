import React from 'react';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import { useIntl } from 'react-intl';
import { VideoBlockSchema } from './schema';
import type { VideoBlockData } from './index';

interface VideoBlockDataProps {
  data: VideoBlockData;
  block: string;
  onChangeBlock: (id: string, data: VideoBlockData) => void;
  [key: string]: any;
}

const VideoBlockDataForm: React.FC<VideoBlockDataProps> = (props) => {
  const { data, block, onChangeBlock } = props;
  const intl = useIntl();
  const schema = VideoBlockSchema({ ...props, intl });

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
      formData={data}
      block={block}
    />
  );
};

export default VideoBlockDataForm;
