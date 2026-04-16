import { defineMessages } from 'react-intl';
import type { BlockSchemaProps } from '@plone/types';

const messages = defineMessages({
  playerBlock: {
    id: 'Player Block',
    defaultMessage: 'Video Player Block',
  },
  playerAutoPlay: {
    id: 'Auto Play',
    defaultMessage: 'Video Auto Play',
  },
  Alignment: {
    id: 'Alignment',
    defaultMessage: 'Alignment',
  },
  size: {
    id: 'Video size',
    defaultMessage: 'Video size',
  },
});

export const VideoPlayerSchema = (props: BlockSchemaProps): any => {
  const { intl } = props;

  const schema: any = {
    title: intl.formatMessage(messages.playerBlock),
    fieldsets: [
      {
        id: 'default',
        title: 'default',
        fields: ['autoPlay', 'size', 'align'],
      },
    ],
    properties: {
      align: {
        title: intl.formatMessage(messages.Alignment),
        widget: 'align',
      },
      autoPlay: {
        title: intl.formatMessage(messages.playerAutoPlay),
        type: 'boolean',
        default: false,
      },
      size: {
        title: intl.formatMessage(messages.size),
        widget: 'image_size',
        default: 'l',
      },
    },
    required: ['align', 'autoPlay'],
  };
  return schema;
};
