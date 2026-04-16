import type { ConfigType } from '@plone/registry';
import VideoSVG from '@plone/volto/icons/video.svg';

function installVideo(config: ConfigType) {
  config.settings.contentIcons.Video = VideoSVG;
  return config;
}

export default function install(config: ConfigType) {
  installVideo(config);
  return config;
}
