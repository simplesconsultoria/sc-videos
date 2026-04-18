import type { ConfigType } from '@plone/registry';
import type { BlockConfigBase } from '@plone/types';
import cloneDeep from 'lodash/cloneDeep';

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

  // Blocks allowed inside Grid block
  const gridLocalBlocks = ['video'];

  ['gridBlock'].forEach((blockId) => {
    const block = (config.blocks.blocksConfig as any)[blockId];
    if (
      block !== undefined &&
      block.allowedBlocks !== undefined &&
      block.blocksConfig !== undefined
    ) {
      block.allowedBlocks = [...block.allowedBlocks, ...gridLocalBlocks];
      gridLocalBlocks.forEach((localBlockId) => {
        block.blocksConfig[localBlockId] = cloneDeep(
          (config.blocks.blocksConfig as any)[localBlockId],
        );
      });
    }
  });

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

  config.blocks.initialBlocks.VideoSeries = [
    { '@type': 'title' },
    { '@type': 'description' },
    { '@type': 'slate' },
  ];

  config.blocks.initialBlocks.Episode = [
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
