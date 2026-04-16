import { composeSchema } from '@plone/volto/helpers/Extensions';
import type { BlockConfigBase } from '@plone/types';
import videoSVG from '@plone/volto/icons/video.svg';
import { defaultStylingSchema } from '@kitconcept/volto-light-theme/components/Blocks/schema';

import type { ImageScalesSummary } from '@simplesconsultoria/volto-videos/types/content';
import { videoSchemaEnhancer } from '@simplesconsultoria/volto-videos/components/Blocks/schema';
import VideoBlockView from './View';
import VideoBlockEdit from './Edit';
import { VideoBlockSchema } from './schema';
import { videoRestrict } from '@simplesconsultoria/volto-videos/helpers/blocks';

export interface VideoHref {
  '@id': string;
  Title: string;
  Description: string;
  hasPreviewImage: boolean;
  image_scales: ImageScalesSummary;
  getRemoteUrl: string;
}

export interface VideoBlockData {
  href: VideoHref[];
  autoPlay?: boolean;
  theme?: string;
  backgroundColor?: string;
  size?: string;
  align: string;
  styles?: any;
}

const VideoBlockInfo: BlockConfigBase = {
  id: 'video',
  title: 'Video',
  icon: videoSVG,
  group: 'video',
  view: VideoBlockView,
  edit: VideoBlockEdit,
  blockSchema: VideoBlockSchema,
  restricted: videoRestrict,
  schemaEnhancer: composeSchema(defaultStylingSchema, videoSchemaEnhancer),
  mostUsed: true,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default VideoBlockInfo;
