import type { Content, Image } from '@plone/types';

export interface IRemoteVideo extends Content {
  videoUrl: string;
  duration: number;
  has_video: boolean;
  text: object;
  preview_image?: Image;
}

export interface ImageScalesSummary {
  [key: string]: Image[];
}
