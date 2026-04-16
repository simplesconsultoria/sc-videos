import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UnconnectedVideoInput } from './VideoInput';

const meta = {
  title: 'Widgets/VideoInput/Edit',
  component: UnconnectedVideoInput,
  decorators: [
    (Story) => (
      <div className="ui segment" style={{ width: '720px', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onSelectItem: (url, item) =>
      // eslint-disable-next-line no-console
      console.log('onSelectItem', { url, item }),
    openObjectBrowser: (options) =>
      // eslint-disable-next-line no-console
      console.log('openObjectBrowser', options),
  },
} satisfies Meta<typeof UnconnectedVideoInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const CustomDescription: Story = {
  args: {
    description: 'Choose a video from the library to embed in this block.',
  },
};
