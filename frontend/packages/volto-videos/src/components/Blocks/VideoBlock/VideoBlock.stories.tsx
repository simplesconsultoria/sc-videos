import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';

import { VideoBlockView } from './View';
import type { VideoBlockData, VideoHref } from './index';

// The View composes the preview as `${href['@id']}/${scales.great.download}`,
// so @id + download below reconstruct the full _metadata.thumbnail_url.
const YOUTUBE_HREF: VideoHref = {
  '@id': 'https://i.ytimg.com/vi/x7QX9tQxEBc',
  Title: 'Sample YouTube Video',
  Description: 'A short clip used to exercise the Video block.',
  hasPreviewImage: true,
  image_scales: {
    preview_image: [
      {
        scales: {
          great: {
            download: 'maxresdefault.jpg',
            width: 1280,
            height: 720,
          },
        },
      },
    ],
  } as unknown as VideoHref['image_scales'],
  videoUrl: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
};

const VIMEO_HREF: VideoHref = {
  '@id': 'https://i.vimeocdn.com/video',
  Title: 'Sample Vimeo Video',
  Description: 'Vimeo source.',
  hasPreviewImage: true,
  image_scales: {
    preview_image: [
      {
        scales: {
          great: {
            download:
              '494898553-7d9ffca85c819d438d3125c608e8cc665a44429ca619f7b2e742149f3e22deb4-d_295x166?region=us',
            width: 295,
            height: 166,
          },
        },
      },
    ],
  } as unknown as VideoHref['image_scales'],
  videoUrl: 'https://vimeo.com/110591222',
};

const YOUTUBE_LIVE_HREF: VideoHref = {
  '@id': 'https://example.com/live-item',
  Title: 'YouTube Live Stream',
  Description: 'A live URL variant.',
  hasPreviewImage: false,
  image_scales: {} as unknown as VideoHref['image_scales'],
  videoUrl: 'https://www.youtube.com/live/ATy8ALW63rQ',
};

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

const baseData: VideoBlockData = {
  href: [YOUTUBE_HREF],
  autoPlay: false,
  align: 'center',
  size: 'l',
};

const meta = {
  title: 'Public/Blocks/VideoBlock',
  component: VideoBlockView,
  decorators: [withWrapper],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object' },
    className: { control: 'text' },
    isEditMode: { control: 'boolean' },
  },
} satisfies Meta<typeof VideoBlockView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: baseData,
  },
};

export const WithPreviewImage: Story = {
  args: {
    data: { ...baseData, href: [YOUTUBE_HREF] },
  },
};

export const Vimeo: Story = {
  args: {
    data: { ...baseData, href: [VIMEO_HREF] },
  },
};

export const YouTubeLive: Story = {
  args: {
    data: { ...baseData, href: [YOUTUBE_LIVE_HREF] },
  },
};

export const MediumSize: Story = {
  args: {
    data: { ...baseData, size: 'm' },
  },
};

export const SmallSize: Story = {
  parameters: { containerWidth: 480 },
  args: {
    data: { ...baseData, size: 's' },
  },
};

export const AlignLeft: Story = {
  args: {
    data: { ...baseData, align: 'left' },
  },
};

export const AlignRight: Story = {
  args: {
    data: { ...baseData, align: 'right' },
  },
};

export const Wide: Story = {
  parameters: { containerWidth: 1200 },
  args: {
    data: { ...baseData, align: 'wide' },
  },
};

export const Autoplay: Story = {
  args: {
    data: { ...baseData, autoPlay: true },
  },
};

export const EditMode: Story = {
  args: {
    data: baseData,
    isEditMode: true,
  },
};

export const NoHref: Story = {
  args: {
    data: { ...baseData, href: [] },
  },
};
