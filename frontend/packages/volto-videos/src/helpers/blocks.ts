import type { Content } from '@plone/types';

interface RestrictProps {
  properties: Content;
}

export const videoPlayerRestrict = ({ properties }: RestrictProps): boolean => {
  const contentType = properties?.['@type'];
  return contentType !== 'Video';
};

export const videoRestrict = ({ properties }: RestrictProps): boolean => {
  return !videoPlayerRestrict({ properties });
};
