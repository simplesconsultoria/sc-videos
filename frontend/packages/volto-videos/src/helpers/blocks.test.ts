import { describe, it, expect } from 'vitest';
import { videoPlayerRestrict, videoRestrict } from './blocks';
import type { Content } from '@plone/types';

const buildProps = (hasVideo: boolean) => ({
  properties: { has_video: hasVideo } as unknown as Content,
});

describe('videoPlayerRestrict', () => {
  it('restricts (returns true) when content has no video', () => {
    expect(videoPlayerRestrict(buildProps(false))).toBe(true);
  });

  it('allows (returns false) when content has video', () => {
    expect(videoPlayerRestrict(buildProps(true))).toBe(false);
  });

  it('restricts when properties is missing has_video', () => {
    expect(videoPlayerRestrict({ properties: {} as unknown as Content })).toBe(
      true,
    );
  });
});

describe('videoRestrict', () => {
  it('is the inverse of videoPlayerRestrict', () => {
    expect(videoRestrict(buildProps(true))).toBe(true);
    expect(videoRestrict(buildProps(false))).toBe(false);
    expect(videoRestrict({ properties: {} as unknown as Content })).toBe(false);
  });
});
