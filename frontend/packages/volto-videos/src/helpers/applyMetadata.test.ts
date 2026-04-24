import { describe, it, expect, vi, beforeAll } from 'vitest';
import config from '@plone/registry';
import installSettings from '@simplesconsultoria/volto-videos/config/settings';
import { applyVideoMetadataToForm } from './applyMetadata';
import type { VideoMetadata } from '@simplesconsultoria/volto-videos/types/widgets';

beforeAll(() => {
  installSettings(config);
});

const baseMetadata: VideoMetadata = {
  service: 'youtube',
  video_id: 'abc123',
  title: 'A Title',
  text: 'A description.',
  duration: 120,
  thumbnail_url: 'https://example.com/thumb.jpg',
  channel: 'A Channel',
  subjects: ['tag-a', 'tag-b'],
};

describe('applyVideoMetadataToForm', () => {
  it('always writes _metadata', () => {
    const onChange = vi.fn();
    applyVideoMetadataToForm({ metadata: baseMetadata, onChange });
    expect(onChange).toHaveBeenCalledWith('_metadata', baseMetadata);
  });

  it('populates every empty field on an empty form', () => {
    const onChange = vi.fn();
    applyVideoMetadataToForm({
      metadata: baseMetadata,
      formData: {},
      onChange,
    });
    const calls = Object.fromEntries(onChange.mock.calls);
    expect(calls.title).toBe('A Title');
    expect(calls.description).toBe('A description.');
    expect(calls.duration).toBe(120);
    expect(calls.channel).toBe('A Channel');
    expect(calls.subjects).toEqual(['tag-a', 'tag-b']);
    expect(calls.video_id).toBe('abc123');
    expect(calls.service).toBe('youtube');
  });

  it('does not overwrite fields already set on the form', () => {
    const onChange = vi.fn();
    applyVideoMetadataToForm({
      metadata: baseMetadata,
      formData: {
        title: 'User Title',
        description: 'User description',
        duration: 999,
        channel: 'User Channel',
        subjects: ['user'],
        video_id: 'user_id',
        service: 'vimeo',
      },
      onChange,
    });
    const ids = onChange.mock.calls.map(([id]) => id);
    expect(ids).toEqual(['_metadata']);
  });

  it('skips scalar fields that are empty in metadata', () => {
    const onChange = vi.fn();
    applyVideoMetadataToForm({
      metadata: {
        ...baseMetadata,
        title: '',
        text: '',
        duration: 0,
        channel: '',
        subjects: [],
        video_id: '',
        service: '',
      } as VideoMetadata,
      formData: {},
      onChange,
    });
    const ids = onChange.mock.calls.map(([id]) => id);
    // subjects is always written when present (empty array is truthy),
    // matching the widget's original behavior.
    expect(ids).toEqual(['_metadata', 'subjects']);
  });

  it('collapses whitespace and line breaks in description', () => {
    const onChange = vi.fn();
    applyVideoMetadataToForm({
      metadata: {
        ...baseMetadata,
        text: 'line one\n\nline two\twith\ntabs   and   spaces',
      },
      formData: {},
      onChange,
    });
    const calls = Object.fromEntries(onChange.mock.calls);
    expect(calls.description).toBe('line one line two with tabs and spaces');
  });

  it('truncates descriptions longer than 150 chars with an ellipsis', () => {
    const longText = 'a'.repeat(400);
    const onChange = vi.fn();
    applyVideoMetadataToForm({
      metadata: { ...baseMetadata, text: longText },
      formData: {},
      onChange,
    });
    const calls = Object.fromEntries(onChange.mock.calls);
    expect(calls.description).toHaveLength(150);
    expect(calls.description.endsWith('...')).toBe(true);
    expect(calls.description.slice(0, 147)).toBe('a'.repeat(147));
  });

  it('does not truncate descriptions at or under 150 chars', () => {
    const text = 'b'.repeat(150);
    const onChange = vi.fn();
    applyVideoMetadataToForm({
      metadata: { ...baseMetadata, text },
      formData: {},
      onChange,
    });
    const calls = Object.fromEntries(onChange.mock.calls);
    expect(calls.description).toBe(text);
  });

  it('honors overridden description truncation settings', () => {
    const originalMaxLength = config.settings.voltoVideos.description.maxLength;
    const originalEllipsis = config.settings.voltoVideos.description.ellipsis;
    config.settings.voltoVideos.description.maxLength = 20;
    config.settings.voltoVideos.description.ellipsis = '…';
    try {
      const onChange = vi.fn();
      applyVideoMetadataToForm({
        metadata: { ...baseMetadata, text: 'a'.repeat(100) },
        formData: {},
        onChange,
      });
      const calls = Object.fromEntries(onChange.mock.calls);
      expect(calls.description).toHaveLength(20);
      expect(calls.description.endsWith('…')).toBe(true);
      expect(calls.description.slice(0, 19)).toBe('a'.repeat(19));
    } finally {
      config.settings.voltoVideos.description.maxLength = originalMaxLength;
      config.settings.voltoVideos.description.ellipsis = originalEllipsis;
    }
  });

  it('treats missing formData the same as an empty form', () => {
    const onChange = vi.fn();
    applyVideoMetadataToForm({ metadata: baseMetadata, onChange });
    const ids = onChange.mock.calls.map(([id]) => id);
    expect(ids).toContain('title');
    expect(ids).toContain('description');
    expect(ids).toContain('service');
  });
});
