/**
 * VideoMetadataWidget component.
 *
 * A hidden widget that stores video metadata as a JSON object.
 * It renders nothing in both edit and view modes.
 */
import React from 'react';

interface VideoMetadataWidgetProps {
  id: string;
  value?: unknown;
  onChange: (id: string, value: unknown) => void;
}

const VideoMetadataWidget: React.FC<VideoMetadataWidgetProps> = () => {
  return <></>;
};

export default VideoMetadataWidget;
