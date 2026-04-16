import type { ConfigType } from '@plone/registry';
import VideoURLWidget from '@simplesconsultoria/volto-videos/components/Widgets/VideoURLWidget';
import VideoURLWidgetView from '@simplesconsultoria/volto-videos/components/Widgets/VideoURLWidgetView';
import VideoMetadataWidget from '@simplesconsultoria/volto-videos/components/Widgets/VideoMetadataWidget';
import VideoMetadataWidgetView from '@simplesconsultoria/volto-videos/components/Widgets/VideoMetadataWidgetView';

export default function install(config: ConfigType) {
  // Edit widgets
  config.widgets.widget.VideoURL = VideoURLWidget;
  config.widgets.widget.VideoMetadata = VideoMetadataWidget;

  // View widgets
  config.widgets.views.widget.VideoURL = VideoURLWidgetView;
  config.widgets.views.widget.VideoMetadata = VideoMetadataWidgetView;

  return config;
}
