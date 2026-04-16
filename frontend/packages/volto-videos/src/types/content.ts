import type { Content, Image } from '@plone/types';

export interface Video extends Content {
  videoUrl: string;
  duration: number;
  text: object;
  preview_image?: Image;
}

export interface ImageScalesSummary {
  [key: string]: Image[];
}
