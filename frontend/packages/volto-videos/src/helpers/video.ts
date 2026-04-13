/**
 * Video URL resolution, thumbnail, and embed URL helpers.
 */
import type {
  VideoSource,
  VideoInfo,
} from '@simplesconsultoria/volto-videos/types/videoPlayer';

export const VIDEO_SOURCES: ReadonlyArray<{
  source: VideoSource;
  pattern: RegExp;
}> = [
  {
    source: 'youtube',
    pattern:
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/,
  },
  {
    source: 'vimeo',
    pattern: /(?:vimeo\.com|player\.vimeo\.com\/video)\/(\d+)/,
  },
];

/**
 * Resolve a video URL to its source and ID.
 * Returns null if the URL doesn't match any known provider.
 */
export function resolveVideo(url: string): VideoInfo | null {
  for (const { source, pattern } of VIDEO_SOURCES) {
    const match = url.match(pattern);
    if (match) {
      return { source, videoId: match[1] };
    }
  }
  return null;
}

/**
 * Return the default thumbnail URL for a video.
 */
export function getDefaultThumbnail(info: VideoInfo): string {
  switch (info.source) {
    case 'youtube':
      return `https://img.youtube.com/vi/${info.videoId}/sddefault.jpg`;
    case 'vimeo':
      return `https://vumbnail.com/${info.videoId}.jpg`;
  }
}

/**
 * Build the embed iframe URL for a video.
 */
export function getEmbedUrl(info: VideoInfo, autoplay: boolean): string {
  switch (info.source) {
    case 'youtube':
      return [
        `https://www.youtube.com/embed/${info.videoId}`,
        '?autohide=true',
        `&autoplay=${autoplay ? 1 : 0}`,
        `&mute=${autoplay ? 1 : 0}`,
        '&modestbranding=1',
        '&rel=0',
      ].join('');
    case 'vimeo':
      return [
        `https://player.vimeo.com/video/${info.videoId}`,
        '?api=false',
        `&autoplay=${autoplay ? 1 : 0}`,
        `&muted=${autoplay ? 1 : 0}`,
        '&byline=false',
        '&portrait=false',
        '&title=false',
      ].join('');
  }
}
