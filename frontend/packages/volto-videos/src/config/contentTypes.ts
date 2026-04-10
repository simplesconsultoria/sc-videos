import type { ConfigType } from '@plone/registry';
import VideoSVG from '@plone/volto/icons/video.svg';
import VideoView from '@simplesconsultoria/volto-videos/components/Views/VideoView';

function installVideo(config: ConfigType) {
  config.settings.contentIcons.Video = VideoSVG;
  return config;
}

export default function install(config: ConfigType) {
  // Views
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    Video: VideoView,
  };
  // Content Types
  installVideo(config);
  return config;
}
