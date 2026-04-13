import type { ConfigType } from '@plone/registry';
import installSettings from './config/settings';
import installContentTypes from './config/contentTypes';
import installWidgets from './config/widgets';

function applyConfig(config: ConfigType) {
  installSettings(config);
  installContentTypes(config);
  installWidgets(config);

  return config;
}

export default applyConfig;
