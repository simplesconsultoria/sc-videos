import { describe, it, expect, beforeAll } from 'vitest';
import config from '@plone/registry';
import installProviders from '@simplesconsultoria/volto-videos/config/providers';
import {
  getVideoProviders,
  resolveVideo,
  getDefaultThumbnail,
  getEmbedUrl,
} from './video';

// Register the built-in providers before all tests
beforeAll(() => {
  installProviders(config);
});

describe('getVideoProviders', () => {
  it('returns youtube and vimeo providers', () => {
    const ids = getVideoProviders().map((p) => p.id);
    expect(ids).toContain('youtube');
    expect(ids).toContain('vimeo');
  });
});

describe('resolveVideo', () => {
  describe('YouTube URLs', () => {
    it.each([
      ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
      ['https://youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
      ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120', 'dQw4w9WgXcQ'],
      ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
      ['https://youtu.be/dQw4w9WgXcQ?t=30', 'dQw4w9WgXcQ'],
      ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
      ['https://www.youtube.com/v/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
      ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
      ['https://www.youtube.com/live/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ])('resolves %s', (url, expectedId) => {
      const result = resolveVideo(url);
      expect(result).toEqual({ source: 'youtube', videoId: expectedId });
    });
  });

  describe('Vimeo URLs', () => {
    it.each([
      ['https://vimeo.com/123456789', '123456789'],
      ['https://www.vimeo.com/123456789', '123456789'],
      ['https://player.vimeo.com/video/123456789', '123456789'],
    ])('resolves %s', (url, expectedId) => {
      const result = resolveVideo(url);
      expect(result).toEqual({ source: 'vimeo', videoId: expectedId });
    });
  });

  describe('unknown URLs', () => {
    it.each([
      'https://www.dailymotion.com/video/x7tgad0',
      'https://example.com/video/123',
      'not-a-url',
      '',
    ])('returns null for %s', (url) => {
      expect(resolveVideo(url)).toBeNull();
    });
  });
});

describe('getDefaultThumbnail', () => {
  it('returns YouTube sddefault thumbnail', () => {
    expect(getDefaultThumbnail({ source: 'youtube', videoId: 'abc123' })).toBe(
      'https://img.youtube.com/vi/abc123/sddefault.jpg',
    );
  });

  it('returns Vimeo vumbnail thumbnail', () => {
    expect(getDefaultThumbnail({ source: 'vimeo', videoId: '999' })).toBe(
      'https://vumbnail.com/999.jpg',
    );
  });

  it('returns null for unknown provider', () => {
    expect(
      getDefaultThumbnail({ source: 'unknown', videoId: '123' }),
    ).toBeNull();
  });
});

describe('getEmbedUrl', () => {
  describe('YouTube', () => {
    const info = { source: 'youtube', videoId: 'abc123' };

    it('builds embed URL without autoplay', () => {
      const url = getEmbedUrl(info, false);
      expect(url).toContain('https://www.youtube.com/embed/abc123');
      expect(url).toContain('autoplay=0');
      expect(url).toContain('mute=0');
      expect(url).toContain('modestbranding=1');
      expect(url).toContain('rel=0');
    });

    it('builds embed URL with autoplay', () => {
      const url = getEmbedUrl(info, true);
      expect(url).toContain('autoplay=1');
      expect(url).toContain('mute=1');
    });
  });

  describe('Vimeo', () => {
    const info = { source: 'vimeo', videoId: '999' };

    it('builds embed URL without autoplay', () => {
      const url = getEmbedUrl(info, false);
      expect(url).toContain('https://player.vimeo.com/video/999');
      expect(url).toContain('autoplay=0');
      expect(url).toContain('muted=0');
      expect(url).toContain('byline=false');
      expect(url).toContain('portrait=false');
      expect(url).toContain('title=false');
    });

    it('builds embed URL with autoplay', () => {
      const url = getEmbedUrl(info, true);
      expect(url).toContain('autoplay=1');
      expect(url).toContain('muted=1');
    });
  });

  it('returns null for unknown provider', () => {
    expect(
      getEmbedUrl({ source: 'unknown', videoId: '123' }, false),
    ).toBeNull();
  });
});
