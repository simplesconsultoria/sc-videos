import type { ConfigType } from '@plone/registry';
import installSettings from './config/settings';
import installContentTypes from './config/contentTypes';

function applyConfig(config: ConfigType) {
  installSettings(config);
  installContentTypes(config);

  return config;
}

export default applyConfig;
