import React from 'react';
import type { Meta } from '@storybook/react';
import { RealStoreWrapper as Wrapper } from '@plone/volto/storybook';
import VideoURLWidgetView from './VideoURLWidgetView';

export const YouTube = () => (
  <VideoURLWidgetView value="https://www.youtube.com/watch?v=x7QX9tQxEBc" />
);

export const Vimeo = () => (
  <VideoURLWidgetView value="https://vimeo.com/110591222" />
);

export const YouTubeLive = () => (
  <VideoURLWidgetView value="https://www.youtube.com/live/ATy8ALW63rQ" />
);

export const WithCustomChildren = () => (
  <VideoURLWidgetView value="https://www.youtube.com/watch?v=x7QX9tQxEBc">
    {(url: string) => <span>Watch: {url}</span>}
  </VideoURLWidgetView>
);

export const Empty = () => <VideoURLWidgetView />;

const meta: Meta<typeof VideoURLWidgetView> = {
  title: 'Widgets/VideoURL/View',
  component: VideoURLWidgetView,
  decorators: [
    (Story) => (
      <Wrapper location={{ pathname: '/folder/doc' }}>
        <div className="ui segment" style={{ width: '480px' }}>
          <h4>VideoURL view widget — renders the URL as a link</h4>
          <Story />
        </div>
      </Wrapper>
    ),
  ],
};

export default meta;
