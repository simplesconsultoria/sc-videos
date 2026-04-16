/**
 * Fetch video metadata from the @@video-metadata service.
 */
import type { VideoMetadata } from '@simplesconsultoria/volto-videos/types/widgets';

export interface FetchVideoMetadataOptions {
  apiPath: string;
  legacyTraverse: boolean;
  contextUrl: string;
}

export interface FetchVideoMetadataResult {
  data: VideoMetadata | null;
  error: string | null;
}

/**
 * Whether `_metadata` represents a real fetched payload or just the empty
 * default ({}) the backend uses for unset content. The widget and EditForm
 * gate UI affordances on this rather than truthiness.
 */
export function isVideoMetadataPopulated(
  metadata: unknown,
): metadata is VideoMetadata {
  if (typeof metadata !== 'object' || metadata === null) return false;
  const candidate = metadata as Partial<VideoMetadata>;
  return (
    typeof candidate.video_id === 'string' && candidate.video_id.length > 0
  );
}

/**
 * Build the full API URL for the video-metadata service.
 */
export function buildMetadataUrl(options: FetchVideoMetadataOptions): string {
  const { apiPath, legacyTraverse, contextUrl } = options;
  const apiSuffix = legacyTraverse ? '' : '/++api++';
  return `${apiPath}${apiSuffix}${contextUrl}/@video-metadata`;
}

/**
 * Fetch video metadata from the backend service.
 *
 * Returns either the metadata or an error message, never throws.
 */
export async function fetchVideoMetadata(
  videoUrl: string,
  options: FetchVideoMetadataOptions,
): Promise<FetchVideoMetadataResult> {
  const url = buildMetadataUrl(options);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ videoUrl }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return {
        data: null,
        error: body.error ?? 'Failed to fetch video metadata',
      };
    }

    const data: VideoMetadata = await response.json();
    return { data, error: null };
  } catch {
    return { data: null, error: 'Failed to connect to metadata service' };
  }
}
