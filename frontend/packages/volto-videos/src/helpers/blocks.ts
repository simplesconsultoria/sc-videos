import type { Content } from '@plone/types';
import type { IRemoteVideo } from '@simplesconsultoria/volto-videos/types/content';

interface RestrictProps {
  properties: Content;
}

/**
 * Tell whether a content item has a video, from its serialized ``videoUrl``.
 *
 * The backend's ``has_video`` is a catalog indexer, so it is not part of the
 * serialized content that the chooser receives. ``videoUrl`` is the field that
 * the indexer depends on, and it is serialized.
 *
 * :param properties: The serialized content item, possibly incomplete.
 * :returns: True when ``videoUrl`` is a non-empty string.
 */
const hasVideoUrl = (properties: Content | undefined): boolean => {
  const videoUrl = (properties as unknown as Partial<IRemoteVideo> | undefined)
    ?.videoUrl;
  return typeof videoUrl === 'string' && videoUrl.trim() !== '';
};

export const videoPlayerRestrict = ({ properties }: RestrictProps): boolean => {
  return !hasVideoUrl(properties);
};

export const videoRestrict = ({ properties }: RestrictProps): boolean => {
  return !videoPlayerRestrict({ properties });
};
