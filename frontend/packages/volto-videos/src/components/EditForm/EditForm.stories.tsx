import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import playerSVG from '@plone/volto/icons/videocamera.svg';
import EditForm from './EditForm';
import {
  YOUTUBE_METADATA,
  videoMetadataSuccessHandlers,
  videoMetadataErrorHandlers,
  videoMetadataNetworkErrorHandlers,
} from '@simplesconsultoria/volto-videos/mocks/videoMetadata';

// Wraps EditForm with local state so the embedded VideoURLWidget can update
// `properties` via `onChangeField` and the changes are visible in the story.
const Stateful: React.FC<React.ComponentProps<typeof EditForm>> = ({
  properties: initial,
  onChangeField,
  ...rest
}) => {
  const [properties, setProperties] = useState(initial);
  return (
    <EditForm
      {...rest}
      properties={properties}
      onChangeField={(id, value) => {
        setProperties((current) => ({ ...current, [id]: value }));
        onChangeField?.(id, value);
      }}
    />
  );
};

const meta = {
  title: 'Components/EditForm',
  component: EditForm,
  decorators: [
    (Story) => (
      <div className="ui segment" style={{ width: '720px', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  args: {
    formHeader: 'External Video',
    formIcon: playerSVG,
    placeholder: 'Please, inform the url of a video from Youtube, Vimeo.',
    onChangeField: () => {},
  },
  render: (args) => <Stateful {...args} />,
} satisfies Meta<typeof EditForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { properties: {} },
};

export const WithYouTubeURL: Story = {
  args: {
    properties: { videoUrl: 'https://www.youtube.com/watch?v=x7QX9tQxEBc' },
  },
};

export const WithVimeoURL: Story = {
  args: {
    properties: { videoUrl: 'https://vimeo.com/110591222' },
  },
};

export const WithMetadata: Story = {
  args: {
    properties: {
      videoUrl: 'https://www.youtube.com/watch?v=x7QX9tQxEBc',
      _metadata: YOUTUBE_METADATA,
    },
  },
};

export const CustomHeader: Story = {
  args: {
    formHeader: 'Add a video to this page',
    placeholder: 'Paste a YouTube or Vimeo URL…',
    properties: {},
  },
};

export const NoIcon: Story = {
  args: {
    formIcon: undefined,
    properties: {},
  },
};

// MSW-driven stories — paste a URL and click the arrow button to exercise
// the metadata fetch in each scenario.
export const FetchSuccess: Story = {
  args: { properties: {} },
  parameters: { msw: { handlers: videoMetadataSuccessHandlers } },
};

export const FetchUnsupportedUrl: Story = {
  args: { properties: {} },
  parameters: { msw: { handlers: videoMetadataErrorHandlers } },
};

export const FetchNetworkError: Story = {
  args: { properties: {} },
  parameters: { msw: { handlers: videoMetadataNetworkErrorHandlers } },
};
