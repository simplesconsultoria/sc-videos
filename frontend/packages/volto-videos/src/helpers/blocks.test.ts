import { describe, it, expect } from 'vitest';
import { videoPlayerRestrict, videoRestrict } from './blocks';
import type { Content } from '@plone/types';

const buildProps = (type: string) => ({
  properties: { '@type': type } as unknown as Content,
});

describe('videoPlayerRestrict', () => {
  it('restricts (returns true) when content type is not Video', () => {
    expect(videoPlayerRestrict(buildProps('Document'))).toBe(true);
    expect(videoPlayerRestrict(buildProps('News Item'))).toBe(true);
  });

  it('allows (returns false) when content type is Video', () => {
    expect(videoPlayerRestrict(buildProps('Video'))).toBe(false);
  });

  it('restricts when properties is missing @type', () => {
    expect(videoPlayerRestrict({ properties: {} as unknown as Content })).toBe(
      true,
    );
  });
});

describe('videoRestrict', () => {
  it('is the inverse of videoPlayerRestrict', () => {
    expect(videoRestrict(buildProps('Video'))).toBe(true);
    expect(videoRestrict(buildProps('Document'))).toBe(false);
    expect(videoRestrict({ properties: {} as unknown as Content })).toBe(false);
  });
});
