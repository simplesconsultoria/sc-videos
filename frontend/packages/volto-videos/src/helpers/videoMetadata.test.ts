import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import config from '@plone/volto/registry';
import { fetchVideoMetadata, isVideoMetadataPopulated } from './videoMetadata';
import {
  YOUTUBE_METADATA,
  VIMEO_METADATA,
  videoMetadataSuccessHandlers,
} from '@simplesconsultoria/volto-videos/mocks/videoMetadata';

const API_PATH = 'http://localhost:3000';
const ENDPOINT = `${API_PATH}/++api++/my-folder/@video-metadata`;
// msw string patterns treat `+` as a modifier, so overrides match by RegExp.
const ENDPOINT_PATTERN = /\/@video-metadata$/;

describe('isVideoMetadataPopulated', () => {
  it('rejects the empty object the backend uses as default', () => {
    expect(isVideoMetadataPopulated({})).toBe(false);
  });

  it('rejects null and undefined', () => {
    expect(isVideoMetadataPopulated(null)).toBe(false);
    expect(isVideoMetadataPopulated(undefined)).toBe(false);
  });

  it('rejects metadata with empty video_id', () => {
    expect(
      isVideoMetadataPopulated({ ...YOUTUBE_METADATA, video_id: '' }),
    ).toBe(false);
  });

  it('accepts a fully populated YouTube metadata payload', () => {
    expect(isVideoMetadataPopulated(YOUTUBE_METADATA)).toBe(true);
  });

  it('accepts a fully populated Vimeo metadata payload', () => {
    expect(isVideoMetadataPopulated(VIMEO_METADATA)).toBe(true);
  });
});

describe('fetchVideoMetadata', () => {
  const server = setupServer(...videoMetadataSuccessHandlers);
  const { settings } = config;
  const originalApiPath = settings.apiPath;
  const originalLegacyTraverse = settings.legacyTraverse;

  /** Record the URL, headers and body of every request the server sees. */
  const captureRequests = () => {
    const seen: Array<{ url: string; headers: Headers; body: unknown }> = [];
    server.events.on('request:start', async ({ request }) => {
      seen.push({
        url: request.url,
        headers: request.headers,
        body: await request.clone().json(),
      });
    });
    return seen;
  };

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  beforeEach(() => {
    settings.apiPath = API_PATH;
    settings.legacyTraverse = false;
  });

  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();
    settings.apiPath = originalApiPath;
    settings.legacyTraverse = originalLegacyTraverse;
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  afterAll(() => server.close());

  it('posts the video URL to the context @video-metadata endpoint', async () => {
    const seen = captureRequests();

    await fetchVideoMetadata(
      'https://youtube.com/watch?v=abc123',
      '/my-folder',
    );

    expect(seen).toHaveLength(1);
    expect(seen[0].url).toBe(ENDPOINT);
    expect(seen[0].body).toEqual({
      videoUrl: 'https://youtube.com/watch?v=abc123',
    });
  });

  it('honours legacyTraverse', async () => {
    settings.legacyTraverse = 'true';
    const seen = captureRequests();

    await fetchVideoMetadata(
      'https://youtube.com/watch?v=abc123',
      '/my-folder',
    );

    expect(seen[0].url).toBe(`${API_PATH}/my-folder/@video-metadata`);
  });

  it('sends the auth_token cookie as a Bearer token', async () => {
    document.cookie = 'auth_token=secret-token';
    const seen = captureRequests();

    await fetchVideoMetadata(
      'https://youtube.com/watch?v=abc123',
      '/my-folder',
    );

    expect(seen[0].headers.get('Authorization')).toBe('Bearer secret-token');
  });

  it('sends no Authorization header without an auth_token cookie', async () => {
    const seen = captureRequests();

    await fetchVideoMetadata(
      'https://youtube.com/watch?v=abc123',
      '/my-folder',
    );

    expect(seen[0].headers.get('Authorization')).toBeNull();
  });

  it('returns YouTube metadata on success', async () => {
    const result = await fetchVideoMetadata(
      'https://youtube.com/watch?v=abc123',
      '/my-folder',
    );

    expect(result.data).toEqual(YOUTUBE_METADATA);
    expect(result.error).toBeNull();
  });

  it('returns Vimeo metadata on success', async () => {
    const result = await fetchVideoMetadata(
      'https://vimeo.com/110591222',
      '/my-folder',
    );

    expect(result.data).toEqual(VIMEO_METADATA);
    expect(result.error).toBeNull();
  });

  it('returns the service error message on an error response', async () => {
    const result = await fetchVideoMetadata(
      'https://bad-url.com',
      '/my-folder',
    );

    expect(result.data).toBeNull();
    expect(result.error).toBe('Unsupported video URL');
  });

  it('returns fallback error when the error body has no message', async () => {
    server.use(
      http.post(ENDPOINT_PATTERN, () =>
        HttpResponse.json(
          {
            message: 'You are not authorized to access this resource.',
            type: 'Unauthorized',
          },
          { status: 401 },
        ),
      ),
    );

    const result = await fetchVideoMetadata(
      'https://youtube.com/watch?v=abc123',
      '/my-folder',
    );

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to fetch video metadata');
  });

  it('returns error on network failure', async () => {
    server.use(http.post(ENDPOINT_PATTERN, () => HttpResponse.error()));

    const result = await fetchVideoMetadata(
      'https://youtube.com/watch?v=abc123',
      '/my-folder',
    );

    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to connect to metadata service');
  });
});
