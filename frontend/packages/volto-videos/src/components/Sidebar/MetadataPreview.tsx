import React from 'react';
import { formatDuration } from '@simplesconsultoria/volto-videos/helpers/format';
import type { VideoMetadata } from '@simplesconsultoria/volto-videos/types/widgets';

interface MetadataPreviewProps {
  metadata: VideoMetadata;
}

const MetadataPreview: React.FC<MetadataPreviewProps> = ({ metadata }) => {
  return (
    <div className="video-metadata-preview">
      {metadata.thumbnail_url && (
        <img
          src={metadata.thumbnail_url}
          alt={metadata.title}
          className="video-thumbnail"
        />
      )}
      <div className="video-metadata-info">
        {metadata.title && (
          <strong className="video-title">{metadata.title}</strong>
        )}
        {metadata.channel && (
          <span className="video-channel"> — {metadata.channel}</span>
        )}
        {metadata.duration > 0 && (
          <span className="video-duration">
            {' '}
            ({formatDuration(metadata.duration)})
          </span>
        )}
      </div>
    </div>
  );
};

export default MetadataPreview;
