import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';

import { VideoPlayerBlockView } from './View';
import type { VideoPlayerBlockData } from './index';
import type { Video as VideoContent } from '@simplesconsultoria/volto-videos/types/content';

const makeContent = (overrides: Partial<VideoContent> = {}): VideoContent =>
  ({
    '@id': 'https://example.com/sample-video',
    '@type': 'Video',
    title: 'Sample Video',
    description: 'A short clip used to exercise the Video Player block.',
    videoUrl: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
    duration: 212,
    text: {},
    preview_image: {
      scales: {
        huge: {
          download: 'https://i.ytimg.com/vi/x7QX9tQxEBc/maxresdefault.jpg',
          width: 1280,
          height: 720,
        },
      },
    } as unknown as VideoContent['preview_image'],
    ...overrides,
  }) as VideoContent;

type StoryParams = {
  containerWidth?: number;
};

const withWrapper: Decorator = (Story, context) => {
  const params = (context?.parameters || {}) as StoryParams;
  const containerWidth = params.containerWidth ?? 960;

  return (
    <Wrapper anonymous>
      <div style={{ width: containerWidth, padding: 24 }}>
        <Story />
      </div>
    </Wrapper>
  );
};

const baseData: VideoPlayerBlockData = {
  autoPlay: false,
  align: 'center',
  size: 'l',
};

const meta = {
  title: 'Public/Blocks/VideoPlayerBlock',
  component: VideoPlayerBlockView,
  decorators: [withWrapper],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object' },
    content: { control: 'object' },
    className: { control: 'text' },
    isEditMode: { control: 'boolean' },
  },
} satisfies Meta<typeof VideoPlayerBlockView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: baseData,
    content: makeContent(),
  },
};

export const NoPreviewImage: Story = {
  args: {
    data: baseData,
    content: makeContent({ preview_image: undefined }),
  },
};

export const Vimeo: Story = {
  args: {
    data: baseData,
    content: makeContent({
      videoUrl: 'https://vimeo.com/110591222',
      title: 'Vimeo Sample',
      preview_image: {
        scales: {
          huge: {
            download:
              'https://i.vimeocdn.com/video/494898553-7d9ffca85c819d438d3125c608e8cc665a44429ca619f7b2e742149f3e22deb4-d_295x166?region=us',
            width: 295,
            height: 166,
          },
        },
      } as unknown as VideoContent['preview_image'],
    }),
  },
};

export const YouTubeLive: Story = {
  args: {
    data: baseData,
    content: makeContent({
      videoUrl: 'https://www.youtube.com/live/ATy8ALW63rQ',
      title: 'Live Stream',
    }),
  },
};

export const MediumSize: Story = {
  args: {
    data: { ...baseData, size: 'm' },
    content: makeContent(),
  },
};

export const SmallSize: Story = {
  parameters: { containerWidth: 480 },
  args: {
    data: { ...baseData, size: 's' },
    content: makeContent(),
  },
};

export const AlignLeft: Story = {
  args: {
    data: { ...baseData, align: 'left' },
    content: makeContent(),
  },
};

export const AlignRight: Story = {
  args: {
    data: { ...baseData, align: 'right' },
    content: makeContent(),
  },
};

export const Wide: Story = {
  parameters: { containerWidth: 1200 },
  args: {
    data: { ...baseData, align: 'wide' },
    content: makeContent(),
  },
};

export const Autoplay: Story = {
  args: {
    data: { ...baseData, autoPlay: true },
    content: makeContent(),
  },
};

export const EditMode: Story = {
  args: {
    data: baseData,
    content: makeContent(),
    isEditMode: true,
  },
};

export const MissingVideoUrl: Story = {
  args: {
    data: baseData,
    content: makeContent({ videoUrl: '' }),
  },
};
