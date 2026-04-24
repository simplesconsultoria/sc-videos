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
  LinkTo: {
    id: 'Link to',
    defaultMessage: 'Link to',
  },
  size: {
    id: 'Video size',
    defaultMessage: 'Video size',
  },
  Alignment: {
    id: 'Alignment',
    defaultMessage: 'Alignment',
  },
  caption: {
    id: 'Caption',
    defaultMessage: 'Caption',
  },
  showCaption: {
    id: 'Display caption',
    defaultMessage: 'Display caption',
  },
  captionTitle: {
    id: 'Caption title',
    defaultMessage: 'Caption title',
  },
  captionDescription: {
    id: 'Caption description',
    defaultMessage: 'Caption description',
  },
});

export const VideoBlockSchema = (props: BlockSchemaProps): any => {
  const { intl } = props;

  const schema: any = {
    title: intl.formatMessage(messages.playerBlock),
    fieldsets: [
      {
        id: 'default',
        title: 'default',
        fields: ['href', 'autoPlay', 'size', 'align'],
      },
      {
        id: 'caption',
        title: intl.formatMessage(messages.caption),
        fields: ['showCaption', 'title', 'description'],
      },
    ],
    properties: {
      href: {
        title: intl.formatMessage(messages.LinkTo),
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: [
          'Title',
          'Description',
          'hasPreviewImage',
          'videoUrl',
        ],
        allowExternals: false,
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
      align: {
        title: intl.formatMessage(messages.Alignment),
        widget: 'align',
      },
      showCaption: {
        title: intl.formatMessage(messages.showCaption),
        type: 'boolean',
        default: true,
      },
      title: {
        title: intl.formatMessage(messages.captionTitle),
      },
      description: {
        title: intl.formatMessage(messages.captionDescription),
        widget: 'textarea',
      },
    },
    required: ['href', 'autoPlay'],
  };

  // Apply default styling schema (themes, colors, etc.)
  return schema;
};
