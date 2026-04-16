import type { ConfigType } from '@plone/registry';
import type { BlockConfigBase } from '@plone/types';

// Player
import VideoBlockInfo from '@simplesconsultoria/volto-videos/components/Blocks/VideoBlock';
import VideoPlayerBlockInfo from '@simplesconsultoria/volto-videos/components/Blocks/VideoPlayerBlock';

declare module '@plone/types' {
  export interface BlocksConfigData {
    video: BlockConfigBase;
    playerBlock: BlockConfigBase;
  }
}

export default function install(config: ConfigType) {
  // Blocks Groups
  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    { id: 'video', title: 'Video' },
  ];

  // Blocks
  config.blocks.blocksConfig.video = VideoBlockInfo;
  config.blocks.blocksConfig.playerBlock = VideoPlayerBlockInfo;

  // Default blocks
  config.blocks.initialBlocks.Video = [
    { '@type': 'title' },
    { '@type': 'description' },
    {
      '@type': 'playerBlock',
      autoPlay: false,
      size: 'l',
      theme: 'grey',
      align: 'wider',
    },
    { '@type': 'slate' },
  ];
  return config;
}
