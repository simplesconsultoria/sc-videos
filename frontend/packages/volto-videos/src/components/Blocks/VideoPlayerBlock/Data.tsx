import React from 'react';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import { useIntl } from 'react-intl';
import { VideoPlayerSchema } from './schema';
import type { VideoPlayerBlockData } from './index';

interface VideoPlayerBlockDataProps {
  data: VideoPlayerBlockData;
  block: string;
  onChangeBlock: (id: string, data: VideoPlayerBlockData) => void;
  [key: string]: any;
}

const VideoPlayerBlockDataForm: React.FC<VideoPlayerBlockDataProps> = (
  props,
) => {
  const { data, block, onChangeBlock } = props;
  const intl = useIntl();
  const schema = VideoPlayerSchema({ ...props, intl });

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
      formData={data}
      block={block}
    />
  );
};

export default VideoPlayerBlockDataForm;
