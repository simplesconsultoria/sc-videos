import type { Content } from '@plone/types';

export interface Video extends Content {
  remoteUrl: string;
  length: number;
}
