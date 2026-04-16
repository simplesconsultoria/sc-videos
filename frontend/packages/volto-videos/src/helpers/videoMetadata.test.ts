import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildMetadataUrl, fetchVideoMetadata } from './videoMetadata';
import type { FetchVideoMetadataOptions } from './videoMetadata';
import {
  YOUTUBE_METADATA,
  VIMEO_METADATA,
} from '@simplesconsultoria/volto-videos/mocks/videoMetadata';

const defaultOptions: FetchVideoMetadataOptions = {
  apiPath: 'http://localhost:3000',
  legacyTraverse: false,
  contextUrl: '/my-folder',
};

describe('buildMetadataUrl', () => {
  it('builds URL with ++api++ suffix', () => {
    expect(buildMetadataUrl(defaultOptions)).toBe(
      'http://localhost:3000/++api++/my-folder/@video-metadata',
    );
  });

  it('builds URL without suffix for legacyTraverse', () => {
    expect(buildMetadataUrl({ ...defaultOptions, legacyTraverse: true })).toBe(
      'http://localhost:3000/my-folder/@video-metadata',
    );
  });

  it('handles empty apiPath', () => {
    expect(buildMetadataUrl({ ...defaultOptions, apiPath: '' })).toBe(
      '/++api++/my-folder/@video-metadata',
    );
  });
});

describe('fetchVideoMetadata', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns YouTube metadata on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(YOUTUBE_METADATA),
      }),
    );

    const result = await fetchVideoMetadata(
      'https://youtube.com/watch?v=abc123',
      defaultOptions,
    );

    expect(result.data).toEqual(YOUTUBE_METADATA);
    expect(result.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/++api++/my-folder/@video-metadata',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          videoUrl: 'https://youtube.com/watch?v=abc123',
        }),
      }),
    );
  });

  it('returns Vimeo metadata on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(VIMEO_METADATA),
      }),
    );

    const result = await fetchVideoMetadata(
      'https://vimeo.com/110591222',
      defaultOptions,
    );

    expect(result.data).toEqual(VIMEO_METADATA);
    expect(result.error).toBeNull();
  });

  it('returns error on non-ok response with error body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Unsupported video URL' }),
      }),
    );

    const result = await fetchVideoMetadata(
      'https://bad-url.com',
      defaultOptions,
    );

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unsupported video URL');
  });

  it('returns fallback error when response body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error('not json')),
      }),
    );

    const result = await fetchVideoMetadata(
      'https://bad-url.com',
      defaultOptions,
    );

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to fetch video metadata');
  });

  it('returns error on network failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error')),
    );

    const result = await fetchVideoMetadata(
      'https://youtube.com/watch?v=abc',
      defaultOptions,
    );

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to connect to metadata service');
  });
});
