import React from 'react';
import withBlockExtensions from '@plone/volto/helpers/Extensions/withBlockExtensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import VideoInput from '@simplesconsultoria/volto-videos/components/Widgets/VideoInput';
import VideoBlockDataForm from './Data';
import VideoBlockView from './View';
import type { VideoBlockData } from './index';

interface VideoBlockEditProps {
  data: VideoBlockData;
  onChangeBlock: (id: string, data: VideoBlockData) => void;
  block: string;
  selected: boolean;
  type: string;
  blocksConfig: Record<string, any>;
  [key: string]: any;
}

const VideoBlockEdit: React.FC<VideoBlockEditProps> = (props) => {
  const { data, onChangeBlock, block, selected, type, blocksConfig } = props;
  const hasVideo = (data.href?.length ?? 0) > 0;

  const onSelectItem = React.useCallback(
    (url: string, item: Record<string, any>) => {
      const dataAdapter = blocksConfig?.[type]?.dataAdapter;
      dataAdapter?.({
        block,
        data,
        onChangeBlock,
        id: 'href',
        value: url,
        item,
      });
    },
    [block, blocksConfig, data, onChangeBlock, type],
  );

  return (
    <>
      {hasVideo ? (
        <VideoBlockView {...props} isEditMode />
      ) : (
        <VideoInput block={block} id={block} onSelectItem={onSelectItem} />
      )}
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
