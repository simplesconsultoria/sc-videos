import React from 'react';
import withBlockExtensions from '@plone/volto/helpers/Extensions/withBlockExtensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import VideoPlayerBlockDataForm from './Data';
import VideoPlayerBlockView from './View';
import type { VideoPlayerBlockData } from './index';

interface VideoPlayerBlockEditProps {
  data: VideoPlayerBlockData;
  onChangeBlock: (id: string, data: VideoPlayerBlockData) => void;
  block: string;
  selected: boolean;
  [key: string]: any;
}

const VideoPlayerBlockEdit: React.FC<VideoPlayerBlockEditProps> = (props) => {
  const { data, onChangeBlock, block, selected } = props;

  return (
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
  );
};

export default withBlockExtensions(VideoPlayerBlockEdit);
