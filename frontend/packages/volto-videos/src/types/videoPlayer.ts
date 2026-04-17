/**
 * A registered video provider that knows how to resolve URLs, generate
 * thumbnails, and build embed iframe URLs for a specific video hosting
 * service.
 *
 * Register providers via `config.registerUtility` in your add-on's
 * `applyConfig`:
 *
 * ```ts
 * config.registerUtility({
 *   name: 'dailymotion',
 *   type: 'videoProvider',
 *   method: () => dailymotionProvider,
 * });
 * ```
 */
export interface VideoProvider {
  /** Unique provider identifier (matches the backend's IVideoMetadataProvider.id). */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** Regex with a capture group that extracts the video ID from a URL. */
  urlPattern: RegExp;
  /** Return the default thumbnail URL for a video ID. */
  getDefaultThumbnail(videoId: string): string;
  /** Return the embed iframe URL for a video ID. */
  getEmbedUrl(videoId: string, autoplay: boolean): string;
}

/**
 * Provider identifier. Widened to `string` so third-party providers can
 * register arbitrary identifiers via the registry.
 */
export type VideoSource = string;

export interface VideoInfo {
  source: VideoSource;
  videoId: string;
}

export interface VideoPlayerProps {
  url: string;
  title?: string;
  previewImage?: string | null;
  autoplay?: boolean;
  aspectRatio?: string;
  className?: string;
}
