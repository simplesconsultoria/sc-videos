import React from 'react';
import type { Meta } from '@storybook/react';
import VideoMetadataWidgetView from './VideoMetadataWidgetView';

export const Default = () => <VideoMetadataWidgetView />;

const meta: Meta<typeof VideoMetadataWidgetView> = {
  title: 'Widgets/VideoMetadata/View',
  component: VideoMetadataWidgetView,
  decorators: [
    (Story) => (
      <div className="ui segment" style={{ width: '480px' }}>
        <h4>VideoMetadata view widget — renders nothing by design</h4>
        <Story />
      </div>
    ),
  ],
};

export default meta;
