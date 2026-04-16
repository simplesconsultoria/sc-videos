import React, { useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import withBlockExtensions from '@plone/volto/helpers/Extensions/withBlockExtensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import playerSVG from '@plone/volto/icons/videocamera.svg';
import EditForm from '@simplesconsultoria/volto-videos/components/EditForm/EditForm';
import { isVideoMetadataPopulated } from '@simplesconsultoria/volto-videos/helpers/videoMetadata';
import VideoPlayerBlockDataForm from './Data';
import VideoPlayerBlockView from './View';
import type { VideoPlayerBlockData } from './index';

const messages = defineMessages({
  editFormHeader: {
    id: 'External Video',
    defaultMessage: 'External Video',
  },
  editFormPlaceholder: {
    id: 'Please, inform the url of a video from Youtube, Vimeo.',
    defaultMessage: 'Please, inform the url of a video from Youtube, Vimeo.',
  },
});

interface VideoPlayerBlockEditProps {
  data: VideoPlayerBlockData;
  onChangeBlock: (id: string, data: VideoPlayerBlockData) => void;
  onChangeField: (id: string, value: unknown) => void;
  properties: Record<string, unknown>;
  block: string;
  selected: boolean;
  [key: string]: any;
}

const VideoPlayerBlockEdit: React.FC<VideoPlayerBlockEditProps> = (props) => {
  const { data, onChangeBlock, onChangeField, properties, block, selected } =
    props;
  const intl = useIntl();

  // The widget writes `videoUrl` on every keystroke, so we can't switch to the
  // player view as soon as `videoUrl` is truthy or the EditForm would vanish
  // mid-paste. Gate on either the URL being there at mount time (existing
  // content) or `_metadata` being populated — only the explicit "fetch" arrow
  // sets `_metadata`, so the transition only happens after a successful fetch.
  const initialUrlRef = useRef<string | undefined>(
    properties?.videoUrl as string | undefined,
  );
  const currentVideoUrl = properties?.videoUrl as string | undefined;
  const hasMetadata = isVideoMetadataPopulated(properties?._metadata);
  const showPlayer =
    !!currentVideoUrl && (!!initialUrlRef.current || hasMetadata);

  return showPlayer ? (
    <>
      <VideoPlayerBlockView {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <VideoPlayerBlockDataForm
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
        />
      </SidebarPortal>
    </>
  ) : (
    <EditForm
      formHeader={intl.formatMessage(messages.editFormHeader)}
      formIcon={playerSVG}
      placeholder={intl.formatMessage(messages.editFormPlaceholder)}
      properties={properties}
      onChangeField={onChangeField}
    />
  );
};

export default withBlockExtensions(VideoPlayerBlockEdit);
