import { describe, it, expect } from 'vitest';
import { videoPlayerRestrict, videoRestrict } from './blocks';
import type { Content } from '@plone/types';

// The serialized content item: `videoUrl` is the field the backend serializes.
const buildProps = (videoUrl: string | null) => ({
  properties: { videoUrl } as unknown as Content,
});

describe('videoPlayerRestrict', () => {
  it('allows (returns false) when the item has a videoUrl', () => {
    expect(
      videoPlayerRestrict(buildProps('https://www.youtube.com/watch?v=abc')),
    ).toBe(false);
  });

  it('restricts (returns true) when the item has no videoUrl', () => {
    expect(videoPlayerRestrict(buildProps(null))).toBe(true);
  });

  it('restricts when videoUrl is empty', () => {
    expect(videoPlayerRestrict(buildProps(''))).toBe(true);
    expect(videoPlayerRestrict(buildProps('   '))).toBe(true);
  });

  it('restricts an item that only has the catalog-only has_video flag', () => {
    const props = {
      properties: { has_video: true } as unknown as Content,
    };
    expect(videoPlayerRestrict(props)).toBe(true);
  });

  it('restricts when properties is an empty object', () => {
    expect(videoPlayerRestrict({ properties: {} as unknown as Content })).toBe(
      true,
    );
  });
});

describe('videoRestrict', () => {
  it('restricts (returns true) on an item that has a videoUrl', () => {
    expect(
      videoRestrict(buildProps('https://www.youtube.com/watch?v=abc')),
    ).toBe(true);
  });

  it('allows (returns false) on an item with no videoUrl', () => {
    expect(videoRestrict(buildProps(null))).toBe(false);
    expect(videoRestrict({ properties: {} as unknown as Content })).toBe(false);
  });
});

describe('restrict functions with incomplete properties', () => {
  it('do not throw when properties is undefined', () => {
    const props = { properties: undefined as unknown as Content };
    expect(() => videoPlayerRestrict(props)).not.toThrow();
    expect(() => videoRestrict(props)).not.toThrow();
    expect(videoPlayerRestrict(props)).toBe(true);
    expect(videoRestrict(props)).toBe(false);
  });
});
