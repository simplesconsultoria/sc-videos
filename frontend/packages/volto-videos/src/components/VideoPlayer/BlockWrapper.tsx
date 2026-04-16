import React from 'react';
import VideoPlayer from '@simplesconsultoria/volto-videos/components/VideoPlayer/VideoPlayer';
import cx from 'classnames';

interface VideoPlayerBlockProps {
  className?: string;
  isEditMode?: boolean;
  style?: React.CSSProperties;
  previewImage?: string | null;
  align?: string;
  size?: string;
  videoUrl?: string;
  title?: string;
  theme?: string;
}

const VideoPlayerBlock: React.FC<VideoPlayerBlockProps> = ({
  previewImage = null,
  videoUrl,
  title,
  className,
  style,
  size,
  align,
  theme = 'default',
}) => {
  return (
    <div
      className={cx(
        'block video align',
        {
          center: !Boolean(align),
        },
        align,
        'contentPlayer',
        `player-theme-${theme}`,
        className,
      )}
      style={style}
    >
      {videoUrl && (
        <figure
          className={cx(
            'figure',
            {
              center: !Boolean(align),
            },
            align,
            {
              large: size === 'l' || !size,
              medium: size === 'm',
              small: size === 's',
            },
          )}
        >
          <VideoPlayer
            url={videoUrl}
            title={title}
            previewImage={previewImage}
          />
        </figure>
      )}
    </div>
  );
};

export default VideoPlayerBlock;
