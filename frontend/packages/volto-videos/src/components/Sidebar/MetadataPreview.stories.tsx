import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MetadataPreview from './MetadataPreview';
import type { VideoMetadata } from '@simplesconsultoria/volto-videos/types/widgets';
import {
  YOUTUBE_METADATA,
  VIMEO_METADATA,
} from '@simplesconsultoria/volto-videos/mocks/videoMetadata';

const meta = {
  title: 'Components/MetadataPreview',
  component: MetadataPreview,
  decorators: [
    (Story) => (
      <div style={{ width: '360px', padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    metadata: { control: 'object' },
  },
} satisfies Meta<typeof MetadataPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YouTube: Story = {
  args: { metadata: YOUTUBE_METADATA as VideoMetadata },
};

export const Vimeo: Story = {
  args: { metadata: VIMEO_METADATA as VideoMetadata },
};

export const NoThumbnail: Story = {
  args: {
    metadata: { ...YOUTUBE_METADATA, thumbnail_url: '' } as VideoMetadata,
  },
};

export const NoChannel: Story = {
  args: {
    metadata: { ...YOUTUBE_METADATA, channel: '' } as VideoMetadata,
  },
};

export const NoDuration: Story = {
  args: {
    metadata: { ...YOUTUBE_METADATA, duration: 0 } as VideoMetadata,
  },
};

export const LongTitle: Story = {
  args: {
    metadata: {
      ...YOUTUBE_METADATA,
      title:
        'An Extremely Long Video Title That Should Still Render Properly in the Sidebar Preview Component',
    } as VideoMetadata,
  },
};

export const MinimalData: Story = {
  args: {
    metadata: {
      service: 'youtube',
      video_id: 'x',
      title: '',
      text: '',
      duration: 0,
      thumbnail_url: '',
      channel: '',
      subjects: [],
    },
  },
};
