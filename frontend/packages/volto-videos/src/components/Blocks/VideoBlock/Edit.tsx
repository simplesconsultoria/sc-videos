import React from 'react';
import withBlockExtensions from '@plone/volto/helpers/Extensions/withBlockExtensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import VideoBlockDataForm from './Data';
import VideoBlockView from './View';
import type { VideoBlockData } from './index';

interface VideoBlockEditProps {
  data: VideoBlockData;
  onChangeBlock: (id: string, data: VideoBlockData) => void;
  block: string;
  selected: boolean;
  [key: string]: any;
}

const VideoBlockEdit: React.FC<VideoBlockEditProps> = (props) => {
  const { data, onChangeBlock, block, selected } = props;

  return (
    <>
      <VideoBlockView {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <VideoBlockDataForm
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
        />
      </SidebarPortal>
    </>
  );
};

export default withBlockExtensions(VideoBlockEdit);
