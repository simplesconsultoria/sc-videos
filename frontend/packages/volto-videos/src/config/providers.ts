import type { ConfigType } from '@plone/registry';
import youtubeProvider from '@simplesconsultoria/volto-videos/providers/youtube';
import vimeoProvider from '@simplesconsultoria/volto-videos/providers/vimeo';

export default function install(config: ConfigType) {
  config.registerUtility({
    name: 'youtube',
    type: 'videoProvider',
    method: () => youtubeProvider,
  });

  config.registerUtility({
    name: 'vimeo',
    type: 'videoProvider',
    method: () => vimeoProvider,
  });

  return config;
}
