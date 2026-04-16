import { composeSchema } from '@plone/volto/helpers/Extensions';
import type { BlockConfigBase } from '@plone/types';
import playerSVG from '@plone/volto/icons/videocamera.svg';
import { defaultStylingSchema } from '@kitconcept/volto-light-theme/components/Blocks/schema';

import { videoSchemaEnhancer } from '@simplesconsultoria/volto-videos/components/Blocks/schema';
import { videoPlayerRestrict } from '@simplesconsultoria/volto-videos/helpers/blocks';
import VideoPlayerBlockView from './View';
import VideoPlayerBlockEdit from './Edit';
import { VideoPlayerSchema } from './schema';

export interface VideoPlayerBlockData {
  autoPlay?: boolean;
  theme?: string;
  backgroundColor?: string;
  styles?: any;
  size?: string;
  align?: string;
}

const VideoPlayerBlockInfo: BlockConfigBase = {
  id: 'playerBlock',
  title: 'Video Player',
  icon: playerSVG,
  group: 'video',
  view: VideoPlayerBlockView,
  edit: VideoPlayerBlockEdit,
  blockSchema: VideoPlayerSchema,
  restricted: videoPlayerRestrict,
  schemaEnhancer: composeSchema(defaultStylingSchema, videoSchemaEnhancer),
  mostUsed: false,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default VideoPlayerBlockInfo;
