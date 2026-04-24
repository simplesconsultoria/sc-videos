import type { ConfigType } from '@plone/registry';

export interface DescriptionTruncationSettings {
  maxLength: number;
  ellipsis: string;
}

export interface VoltoVideosSettings {
  description: DescriptionTruncationSettings;
}

declare module '@plone/types' {
  export interface SettingsConfig {
    voltoVideos: VoltoVideosSettings;
  }
}

export default function install(config: ConfigType) {
  config.settings.voltoVideos = {
    description: {
      maxLength: 150,
      ellipsis: '...',
    },
  };

  return config;
}
