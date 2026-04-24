import React from 'react';
import withBlockExtensions from '@plone/volto/helpers/Extensions/withBlockExtensions';
import Caption from '@kitconcept/volto-light-theme/components/Caption/Caption';
import type { VideoBlockData } from './index';
import VideoPlayerBlock from '@simplesconsultoria/volto-videos/components/VideoPlayer/BlockWrapper';

interface VideoBlockViewProps {
  data: VideoBlockData;
  className?: string;
  isEditMode?: boolean;
  style?: React.CSSProperties;
}

export const VideoBlockView: React.FC<VideoBlockViewProps> = ({
  data,
  className,
  style,
}) => {
  const theme = data.styles?.theme || 'default';
  const href = data.href?.[0] || {};
  const { Title, image_scales, videoUrl } = href;
  const previewImagePath =
    image_scales?.preview_image?.[0]?.scales?.great?.download || null;
  const previewImage = previewImagePath
    ? `${href['@id']}/${previewImagePath}`
    : null;
  const showCaption = data.showCaption !== false;
  const hasCaption = Boolean(showCaption && (data.title || data.description));
  return (
    <VideoPlayerBlock
      videoUrl={videoUrl}
      title={Title}
      previewImage={previewImage}
      theme={theme}
      size={data.size}
      align={data.align}
      className={className}
      style={style}
    >
      {hasCaption && (
        <Caption title={data.title} description={data.description} />
      )}
    </VideoPlayerBlock>
  );
};

export default withBlockExtensions(VideoBlockView);
