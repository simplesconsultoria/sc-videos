import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import VideoPlayer from './VideoPlayer';

type StoryParams = {
  containerWidth?: number;
};

const withWrapper: Decorator = (Story, context) => {
  const params = (context?.parameters || {}) as StoryParams;
  const containerWidth = params.containerWidth ?? 640;

  return (
    <Wrapper anonymous>
      <div style={{ width: containerWidth, padding: 16 }}>
        <Story />
      </div>
    </Wrapper>
  );
};

const meta = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  decorators: [withWrapper],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    url: { control: 'text' },
    title: { control: 'text' },
    previewImage: { control: 'text' },
    autoplay: { control: 'boolean' },
    aspectRatio: {
      control: 'select',
      options: ['aspect-16-9', 'aspect-4-3', 'aspect-1-1'],
    },
    className: { control: 'text' },
  },
} satisfies Meta<typeof VideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YouTube: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
    title: 'Sample YouTube Video',
  },
};

export const YouTubeWithPreview: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
    title: 'Sample YouTube Video',
    previewImage: 'https://i.ytimg.com/vi/x7QX9tQxEBc/maxresdefault.jpg',
  },
};

export const YouTubeLive: Story = {
  args: {
    url: 'https://www.youtube.com/live/ATy8ALW63rQ',
    title: 'YouTube Live Stream',
  },
};

export const Vimeo: Story = {
  args: {
    url: 'https://vimeo.com/110591222',
    title: 'Sample Vimeo Video',
  },
};

export const VimeoWithPreview: Story = {
  args: {
    url: 'https://vimeo.com/110591222',
    title: 'Sample Vimeo Video',
    previewImage:
      'https://i.vimeocdn.com/video/494898553-7d9ffca85c819d438d3125c608e8cc665a44429ca619f7b2e742149f3e22deb4-d_295x166?region=us',
  },
};

export const Autoplay: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
    title: 'Autoplay Video',
    autoplay: true,
  },
};

export const AspectRatio4x3: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
    title: '4:3 Aspect Ratio',
    aspectRatio: 'aspect-4-3',
  },
};

export const NarrowContainer: Story = {
  parameters: { containerWidth: 320 },
  args: {
    url: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
    title: 'Narrow Container',
  },
};

export const WideContainer: Story = {
  parameters: { containerWidth: 1200 },
  args: {
    url: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
    title: 'Wide Container',
  },
};

export const NoTitle: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
  },
};

export const InvalidUrl: Story = {
  args: {
    url: 'https://example.com/not-a-video',
    title: 'Invalid URL',
  },
};
