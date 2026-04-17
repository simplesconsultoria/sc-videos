import type { Content } from '@plone/types';
import type { IRemoteVideo } from '@simplesconsultoria/volto-videos/types/content';

interface RestrictProps {
  properties: Content;
}

export const videoPlayerRestrict = ({ properties }: RestrictProps): boolean => {
  return !(properties as unknown as IRemoteVideo)?.has_video;
};

export const videoRestrict = ({ properties }: RestrictProps): boolean => {
  return !videoPlayerRestrict({ properties });
};
