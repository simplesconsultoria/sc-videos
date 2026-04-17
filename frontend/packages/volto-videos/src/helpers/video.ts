/**
 * Video URL resolution, thumbnail, and embed URL helpers.
 *
 * All provider logic is looked up from the @plone/registry utility system,
 * so third-party add-ons can register new providers without patching this module.
 */
import config from '@plone/registry';
import type {
  VideoProvider,
  VideoInfo,
} from '@simplesconsultoria/volto-videos/types/videoPlayer';

/**
 * Return every registered VideoProvider.
 */
export function getVideoProviders(): VideoProvider[] {
  const utilities = config.getUtilities({ type: 'videoProvider' });
  return utilities.map((u) => u.method());
}

/**
 * Resolve a video URL to its source and ID.
 * Returns null if the URL doesn't match any registered provider.
 */
export function resolveVideo(url: string): VideoInfo | null {
  for (const provider of getVideoProviders()) {
    const match = url.match(provider.urlPattern);
    if (match) {
      return { source: provider.id, videoId: match[1] };
    }
  }
  return null;
}

/**
 * Return the default thumbnail URL for a video.
 */
export function getDefaultThumbnail(info: VideoInfo): string | null {
  const provider = getVideoProviders().find((p) => p.id === info.source);
  if (!provider) return null;
  return provider.getDefaultThumbnail(info.videoId);
}

/**
 * Build the embed iframe URL for a video.
 */
export function getEmbedUrl(info: VideoInfo, autoplay: boolean): string | null {
  const provider = getVideoProviders().find((p) => p.id === info.source);
  if (!provider) return null;
  return provider.getEmbedUrl(info.videoId, autoplay);
}
