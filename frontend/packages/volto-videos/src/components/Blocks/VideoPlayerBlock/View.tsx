import React from 'react';
import withBlockExtensions from '@plone/volto/helpers/Extensions/withBlockExtensions';
import type { VideoPlayerBlockData } from './index';
import type { Video as VideoContent } from '@simplesconsultoria/volto-videos/types/content';
import VideoPlayerBlock from '@simplesconsultoria/volto-videos/components/VideoPlayer/BlockWrapper';

interface VideoPlayerBlockViewProps {
  data: VideoPlayerBlockData;
  className?: string;
  isEditMode?: boolean;
  style?: React.CSSProperties;
  content: VideoContent;
}

export const VideoPlayerBlockView: React.FC<VideoPlayerBlockViewProps> = ({
  data,
  className,
  content,
  style,
}) => {
  const theme = data.styles?.theme || 'default';
  const { title, videoUrl } = content;
  const previewImage = content.preview_image?.scales?.huge?.download ?? null;
  return (
    <VideoPlayerBlock
      videoUrl={videoUrl}
      title={title}
      previewImage={previewImage}
      theme={theme}
      size={data.size}
      align={data.align}
      className={className}
      style={style}
    />
  );
};

export default withBlockExtensions(VideoPlayerBlockView);
