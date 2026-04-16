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

// Maps each form field to the metadata key that populates it,
// plus an optional transform applied before writing.
const FIELD_MAPPINGS: ReadonlyArray<{
  field: string;
  source: keyof VideoMetadata;
  transform?: (value: string) => unknown;
}> = [
  { field: 'title', source: 'title' },
  { field: 'description', source: 'text', transform: buildDescription },
  { field: 'duration', source: 'duration' },
  { field: 'channel', source: 'channel' },
  { field: 'subjects', source: 'subjects' },
  { field: 'video_id', source: 'video_id' },
  { field: 'service', source: 'service' },
];

export function applyVideoMetadataToForm({
  metadata,
  formData,
  onChange,
}: ApplyMetadataOptions): void {
  onChange('_metadata', metadata);

  for (const { field, source, transform } of FIELD_MAPPINGS) {
    const raw = metadata[source];
    if (!formData?.[field] && raw) {
      onChange(field, transform ? transform(raw as string) : raw);
    }
  }
}
