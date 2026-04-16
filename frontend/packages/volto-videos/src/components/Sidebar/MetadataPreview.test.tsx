import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MetadataPreview from './MetadataPreview';
import type { VideoMetadata } from '@simplesconsultoria/volto-videos/types/widgets';

const baseMetadata: VideoMetadata = {
  service: 'youtube',
  video_id: 'abc123',
  title: 'Test Video',
  text: 'Description',
  duration: 125,
  thumbnail_url: 'https://example.com/thumb.jpg',
  channel: 'Test Channel',
  subjects: [],
};

describe('MetadataPreview', () => {
  it('renders thumbnail when thumbnail_url is present', () => {
    const { container } = render(<MetadataPreview metadata={baseMetadata} />);
    const img = container.querySelector('img.video-thumbnail');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe('https://example.com/thumb.jpg');
    expect(img?.getAttribute('alt')).toBe('Test Video');
  });

  it('omits thumbnail when thumbnail_url is empty', () => {
    const { container } = render(
      <MetadataPreview metadata={{ ...baseMetadata, thumbnail_url: '' }} />,
    );
    expect(container.querySelector('img.video-thumbnail')).toBeNull();
  });

  it('renders title', () => {
    const { container } = render(<MetadataPreview metadata={baseMetadata} />);
    expect(container.querySelector('.video-title')?.textContent).toBe(
      'Test Video',
    );
  });

  it('omits title when empty', () => {
    const { container } = render(
      <MetadataPreview metadata={{ ...baseMetadata, title: '' }} />,
    );
    expect(container.querySelector('.video-title')).toBeNull();
  });

  it('renders channel', () => {
    const { container } = render(<MetadataPreview metadata={baseMetadata} />);
    expect(container.querySelector('.video-channel')?.textContent).toContain(
      'Test Channel',
    );
  });

  it('omits channel when empty', () => {
    const { container } = render(
      <MetadataPreview metadata={{ ...baseMetadata, channel: '' }} />,
    );
    expect(container.querySelector('.video-channel')).toBeNull();
  });

  it('renders formatted duration when > 0', () => {
    const { container } = render(<MetadataPreview metadata={baseMetadata} />);
    expect(container.querySelector('.video-duration')?.textContent).toContain(
      '02:05',
    );
  });

  it('omits duration when 0', () => {
    const { container } = render(
      <MetadataPreview metadata={{ ...baseMetadata, duration: 0 }} />,
    );
    expect(container.querySelector('.video-duration')).toBeNull();
  });
});
