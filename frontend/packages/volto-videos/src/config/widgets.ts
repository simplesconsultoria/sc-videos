import type { ConfigType } from '@plone/registry';
import VideoURLWidget from '@simplesconsultoria/volto-videos/components/Widgets/VideoURLWidget';
import VideoURLWidgetView from '@simplesconsultoria/volto-videos/components/Widgets/VideoURLWidgetView';
import VideoMetadataWidget from '@simplesconsultoria/volto-videos/components/Widgets/VideoMetadataWidget';
import VideoMetadataWidgetView from '@simplesconsultoria/volto-videos/components/Widgets/VideoMetadataWidgetView';

export default function install(config: ConfigType) {
  // Edit widgets
  config.registerWidget({
    key: 'widget',
    definition: { VideoURL: VideoURLWidget },
  });
  config.registerWidget({
    key: 'widget',
    definition: { VideoMetadata: VideoMetadataWidget },
  });

  // View widgets
  /// Volto still lacks the ability to register view widgets, so we need to add them manually here.
  config.widgets.views.widget.VideoURL = VideoURLWidgetView;
  config.widgets.views.widget.VideoMetadata = VideoMetadataWidgetView;

  return config;
}
