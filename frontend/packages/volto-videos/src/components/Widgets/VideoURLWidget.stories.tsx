import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import VideoURLWidget from './VideoURLWidget';
import WidgetStory from '@plone/volto/components/manage/Widgets/story';
import {
  videoMetadataSuccessHandlers,
  videoMetadataErrorHandlers,
  videoMetadataNetworkErrorHandlers,
} from '@simplesconsultoria/volto-videos/mocks/videoMetadata';

export const Empty = (WidgetStory as StoryFn).bind({
  props: {
    id: 'videoUrl',
    title: 'Video URL',
    description: 'Paste a YouTube or Vimeo URL.',
    required: true,
  },
  widget: VideoURLWidget,
});

export const WithYouTubeValue = (WidgetStory as StoryFn).bind({
  props: {
    id: 'videoUrl',
    title: 'Video URL',
    description: 'A YouTube video URL pre-filled.',
    value: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
  },
  widget: VideoURLWidget,
});

export const WithVimeoValue = (WidgetStory as StoryFn).bind({
  props: {
    id: 'videoUrl',
    title: 'Video URL',
    description: 'A Vimeo video URL pre-filled.',
    value: 'https://vimeo.com/110591222',
  },
  widget: VideoURLWidget,
});

export const WithExistingMetadata = (WidgetStory as StoryFn).bind({
  props: {
    id: 'videoUrl',
    title: 'Video URL',
    value: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
    formData: {
      _metadata: {
        service: 'youtube',
        video_id: 'x7QX9tQxEBc',
        title: 'Sample YouTube Video',
        text: 'A short clip used to exercise the Video URL widget.',
        duration: 212,
        thumbnail_url: 'https://i.ytimg.com/vi/x7QX9tQxEBc/maxresdefault.jpg',
        channel: 'Sample Channel',
        subjects: ['sample', 'video'],
      },
    },
  },
  widget: VideoURLWidget,
});

export const Disabled = (WidgetStory as StoryFn).bind({
  props: {
    id: 'videoUrl',
    title: 'Video URL',
    description: 'Widget rendered in disabled mode.',
    value: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
    isDisabled: true,
  },
  widget: VideoURLWidget,
});

// MSW-driven stories — click the arrow button to fetch metadata.
export const FetchSuccess = (WidgetStory as StoryFn).bind({
  props: {
    id: 'videoUrl',
    title: 'Video URL (Success)',
    description:
      'Paste a YouTube/Vimeo URL and click the arrow — MSW returns canned metadata.',
  },
  widget: VideoURLWidget,
});
FetchSuccess.parameters = {
  msw: { handlers: videoMetadataSuccessHandlers },
};

export const FetchUnsupportedUrl = (WidgetStory as StoryFn).bind({
  props: {
    id: 'videoUrl',
    title: 'Video URL (Unsupported)',
    description: 'MSW always returns a 400 to simulate an unsupported URL.',
  },
  widget: VideoURLWidget,
});
FetchUnsupportedUrl.parameters = {
  msw: { handlers: videoMetadataErrorHandlers },
};

export const FetchNetworkError = (WidgetStory as StoryFn).bind({
  props: {
    id: 'videoUrl',
    title: 'Video URL (Network error)',
    description: 'MSW drops the connection to simulate a network failure.',
  },
  widget: VideoURLWidget,
});
FetchNetworkError.parameters = {
  msw: { handlers: videoMetadataNetworkErrorHandlers },
};

const meta: Meta<typeof VideoURLWidget> = {
  title: 'Widgets/VideoURL/Edit',
  component: VideoURLWidget,
  decorators: [
    (Story) => (
      <div className="ui segment form attached" style={{ width: '480px' }}>
        <h4>VideoURL widget — paste a video URL and fetch metadata</h4>
        <Story />
      </div>
    ),
  ],
};

export default meta;
