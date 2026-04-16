/**
 * MSW handlers for the `@video-metadata` endpoint.
 *
 * Handlers match both traverse styles (`++api++/...` and direct) so they
 * work regardless of how `buildMetadataUrl` is configured.
 */
import { http, HttpResponse } from 'msw';

const ENDPOINT_PATTERNS = ['*/++api++/*/@video-metadata', '*/@video-metadata'];

export const YOUTUBE_METADATA = {
  service: 'youtube',
  video_id: 'x7QX9tQxEBc',
  title: 'Sample YouTube Video',
  text: 'A short clip used to exercise the VideoURL widget.',
  duration: 212,
  thumbnail_url: 'https://i.ytimg.com/vi/x7QX9tQxEBc/maxresdefault.jpg',
  channel: 'Sample Channel',
  subjects: ['sample', 'video'],
};

export const VIMEO_METADATA = {
  service: 'vimeo',
  video_id: '110591222',
  title: 'Sample Vimeo Video',
  text: 'A Vimeo clip used to exercise the VideoURL widget.',
  duration: 180,
  thumbnail_url:
    'https://i.vimeocdn.com/video/494898553-7d9ffca85c819d438d3125c608e8cc665a44429ca619f7b2e742149f3e22deb4-d_295x166?region=us',
  channel: 'Sample Vimeo Channel',
  subjects: ['sample', 'vimeo'],
};

const pickMetadata = (url: string) => {
  if (url.includes('vimeo.com')) return VIMEO_METADATA;
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return YOUTUBE_METADATA;
  }
  return null;
};

export const videoMetadataSuccessHandlers = ENDPOINT_PATTERNS.map((pattern) =>
  http.post(pattern, async ({ request }) => {
    const body = (await request.json()) as { videoUrl?: string };
    const data = pickMetadata(body.videoUrl ?? '');
    if (!data) {
      return HttpResponse.json(
        { error: 'Unsupported video URL' },
        { status: 400 },
      );
    }
    return HttpResponse.json(data);
  }),
);

export const videoMetadataErrorHandlers = ENDPOINT_PATTERNS.map((pattern) =>
  http.post(pattern, () =>
    HttpResponse.json({ error: 'Unsupported video URL' }, { status: 400 }),
  ),
);

export const videoMetadataNetworkErrorHandlers = ENDPOINT_PATTERNS.map(
  (pattern) => http.post(pattern, () => HttpResponse.error()),
);
