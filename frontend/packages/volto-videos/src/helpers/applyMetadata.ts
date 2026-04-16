/**
 * Populate empty form fields from fetched video metadata.
 *
 * Only fields that are empty on the current form are written, so user edits
 * are never overwritten.
 */
import type { VideoMetadata } from '@simplesconsultoria/volto-videos/types/widgets';

const DESCRIPTION_MAX_LENGTH = 150;
const DESCRIPTION_ELLIPSIS = '...';

function buildDescription(text: string): string {
  // Remove line breaks and truncate long descriptions for better display in the UI
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= DESCRIPTION_MAX_LENGTH) {
    return collapsed;
  }
  const cut = DESCRIPTION_MAX_LENGTH - DESCRIPTION_ELLIPSIS.length;
  return collapsed.substring(0, cut) + DESCRIPTION_ELLIPSIS;
}

interface ApplyMetadataOptions {
  metadata: VideoMetadata;
  formData?: Record<string, unknown>;
  onChange: (id: string, value: unknown) => void;
}

export function applyVideoMetadataToForm({
  metadata,
  formData,
  onChange,
}: ApplyMetadataOptions): void {
  onChange('_metadata', metadata);

  if (!formData?.title && metadata.title) {
    onChange('title', metadata.title);
  }
  if (!formData?.description && metadata.text) {
    onChange('description', buildDescription(metadata.text));
  }
  if (!formData?.duration && metadata.duration) {
    onChange('duration', metadata.duration);
  }
  if (!formData?.channel && metadata.channel) {
    onChange('channel', metadata.channel);
  }
  if (!formData?.subjects && metadata.subjects) {
    onChange('subjects', metadata.subjects);
  }
  if (!formData?.video_id && metadata.video_id) {
    onChange('video_id', metadata.video_id);
  }
  if (!formData?.service && metadata.service) {
    onChange('service', metadata.service);
  }
}
