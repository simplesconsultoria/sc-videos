/**
 * VideoInput — in-block placeholder that lets editors pick an existing Video
 * content to embed.
 *
 * Mirrors the kitconcept Image block pattern (`ImageInput` with the upload
 * and link-URL affordances stripped out): a single button opens the Volto
 * object browser filtered to `Video` content. On selection, the host block's
 * `onSelectItem` callback fires — the block is expected to delegate to its
 * registered `dataAdapter` to commit the picked video to block data.
 *
 * External URLs are intentionally *not* supported; use the content's own
 * `videoUrl` field (edited via `VideoURLWidget`) for that.
 */
import React from 'react';
import { Button, Message } from 'semantic-ui-react';
import { compose } from 'redux';
import { defineMessages, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import videoSVG from '@plone/volto/icons/videocamera.svg';

export interface VideoInputProps {
  /** Block id (or any stable id) — used by withObjectBrowser internals. */
  id?: string;
  /** Block id for reference. */
  block?: string;
  /** Optional override for the placeholder description. */
  description?: string;
  /** Whether this block is currently selected; forwarded for parity. */
  selected?: boolean;
  /** Called when the user clicks the placeholder to focus the host block. */
  onFocus?: () => void;
  /** Invoked with the selected video's `@id` and the full catalog item. */
  onSelectItem: (url: string, item: Record<string, any>) => void;
  /**
   * Injected by `withObjectBrowser`. Opens the sidebar object browser pop-up
   * configured to search only Video content.
   */
  openObjectBrowser?: (options: Record<string, any>) => void;
}

const messages = defineMessages({
  pickAVideo: {
    id: 'pickAVideo',
    defaultMessage: 'Pick an existing video',
  },
  pickAVideoDescription: {
    id: 'Browse the site for a video to embed',
    defaultMessage: 'Browse the site for a video to embed',
  },
});

const VIDEO_PORTAL_TYPES = ['Video'];

export const UnconnectedVideoInput: React.FC<VideoInputProps> = ({
  description,
  onFocus,
  onSelectItem,
  openObjectBrowser,
}) => {
  const intl = useIntl();
  const location = useLocation();
  const contextUrl = location.pathname;

  return (
    <div
      className="video-upload-widget"
      onClick={onFocus}
      onKeyDown={onFocus}
      role="toolbar"
    >
      <Message>
        <Icon name={videoSVG} className="placeholder" size="60px" />
        <p>
          {description ?? intl.formatMessage(messages.pickAVideoDescription)}
        </p>
        <div className="toolbar-wrapper">
          <Button.Group>
            <Button
              aria-label={intl.formatMessage(messages.pickAVideo)}
              icon
              basic
              type="button"
              onClick={(e: React.MouseEvent) => {
                onFocus?.();
                e.preventDefault();
                openObjectBrowser?.({
                  mode: 'link',
                  searchableTypes: VIDEO_PORTAL_TYPES,
                  selectableTypes: VIDEO_PORTAL_TYPES,
                  onSelectItem,
                  currentPath: contextUrl,
                });
              }}
            >
              <Icon name={navTreeSVG} size="24px" />
            </Button>
          </Button.Group>
        </div>
      </Message>
    </div>
  );
};

const VideoInput = compose(withObjectBrowser)(
  UnconnectedVideoInput,
) as React.FC<Omit<VideoInputProps, 'openObjectBrowser'>>;

export default VideoInput;
