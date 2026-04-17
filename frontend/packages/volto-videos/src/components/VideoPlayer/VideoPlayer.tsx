/**
 * VideoPlayer component.
 *
 * A modular video player that supports multiple sources (YouTube, Vimeo)
 * with preview image handling and click-to-play behavior.
 */
import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import Image from '@plone/volto/components/theme/Image/Image';
import PlayIcon from '@plone/volto/icons/play.svg';
import type { VideoPlayerProps } from '@simplesconsultoria/volto-videos/types/videoPlayer';
import {
  resolveVideo,
  getDefaultThumbnail,
  getEmbedUrl,
} from '@simplesconsultoria/volto-videos/helpers/video';

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  previewImage,
  autoplay = false,
  aspectRatio = 'aspect-16-9',
  className,
}) => {
  const [isActive, setIsActive] = useState(false);

  const play = useCallback(() => {
    setIsActive(true);
  }, []);

  const videoInfo = url ? resolveVideo(url) : null;

  if (!videoInfo) {
    return null;
  }

  const placeholder = previewImage || getDefaultThumbnail(videoInfo) || '';
  const embedUrl = getEmbedUrl(videoInfo, isActive || autoplay);

  if (!embedUrl) {
    return null;
  }

  return (
    <div
      className={cx(
        'video-player',
        `video-player--${videoInfo.source}`,
        aspectRatio,
        className,
      )}
    >
      {isActive || autoplay ? (
        <iframe
          allowFullScreen
          height="100%"
          width="100%"
          src={embedUrl}
          style={{ border: 0 }}
          title={title ? `${title}` : `Video from ${videoInfo.source}`}
          allow="autoplay; encrypted-media; fullscreen"
        />
      ) : (
        <>
          {placeholder ? (
            <Image
              className="video-player__placeholder"
              src={placeholder}
              alt={title || ''}
            />
          ) : (
            <div className="video-player__placeholder video-player__placeholder--fallback" />
          )}
          <button
            className="video-player__play-button"
            onClick={play}
            aria-label={title ? `Play ${title}` : 'Play video'}
          >
            <Icon name={PlayIcon} color="white" size="100%" />
          </button>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
