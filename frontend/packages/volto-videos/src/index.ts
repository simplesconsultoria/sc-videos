import type { ConfigType } from '@plone/registry';
import installBlocks from './config/blocks';
import installContentTypes from './config/contentTypes';
import installSettings from './config/settings';
import installWidgets from './config/widgets';

function applyConfig(config: ConfigType) {
  installSettings(config);
  installContentTypes(config);
  installWidgets(config);
  installBlocks(config);

  return config;
}

export default applyConfig;
