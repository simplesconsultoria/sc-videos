/**
 * Fetch video metadata from the @@video-metadata service.
 */
import Api from '@plone/volto/helpers/Api/Api';
import type { VideoMetadata } from '@simplesconsultoria/volto-videos/types/widgets';

export interface FetchVideoMetadataResult {
  data: VideoMetadata | null;
  error: string | null;
}

/**
 * Volto's `Api` attaches its HTTP methods at runtime, so TypeScript cannot
 * see them; this types the one we use.
 */
interface ApiClient {
  post: <T>(path: string, options: { data: unknown }) => Promise<T>;
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
 * Fetch video metadata from the backend service.
 *
 * Goes through Volto's `Api` client, which resolves the API URL and sends
 * the `auth_token` cookie as a Bearer token. A plain `fetch` reaches Plone
 * as Anonymous, because plone.restapi never reads that cookie.
 *
 * Returns either the metadata or an error message, never throws.
 */
export async function fetchVideoMetadata(
  videoUrl: string,
  contextUrl: string,
): Promise<FetchVideoMetadataResult> {
  const api = new Api() as unknown as ApiClient;
  try {
    const data = await api.post<VideoMetadata>(
      `${contextUrl}/@video-metadata`,
      { data: { videoUrl } },
    );
    return { data, error: null };
  } catch (err: any) {
    if (!err?.response) {
      return { data: null, error: 'Failed to connect to metadata service' };
    }
    return {
      data: null,
      error: err.response.body?.error ?? 'Failed to fetch video metadata',
    };
  }
}
