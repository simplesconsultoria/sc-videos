import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import VideoMetadataWidget from './VideoMetadataWidget';
import WidgetStory from '@plone/volto/components/manage/Widgets/story';

export const Hidden = (WidgetStory as StoryFn).bind({
  props: {
    id: '_metadata',
    title: 'Video Metadata',
    description:
      'Hidden widget: stores fetched metadata as JSON. It intentionally renders nothing.',
  },
  widget: VideoMetadataWidget,
});

export const WithMetadataValue = (WidgetStory as StoryFn).bind({
  props: {
    id: '_metadata',
    title: 'Video Metadata',
    description: 'The widget renders nothing even when a value is present.',
    value: {
      service: 'youtube',
      video_id: 'x7QX9tQxEBc',
      title: 'Sample YouTube Video',
      text: 'A short clip.',
      duration: 212,
      thumbnail_url: 'https://i.ytimg.com/vi/x7QX9tQxEBc/maxresdefault.jpg',
      channel: 'Sample Channel',
      subjects: ['sample'],
    },
  },
  widget: VideoMetadataWidget,
});

const meta: Meta<typeof VideoMetadataWidget> = {
  title: 'Widgets/VideoMetadata/Edit',
  component: VideoMetadataWidget,
  decorators: [
    (Story) => (
      <div className="ui segment form attached" style={{ width: '480px' }}>
        <h4>VideoMetadata widget — hidden; stores JSON programmatically</h4>
        <Story />
      </div>
    ),
  ],
};

export default meta;
