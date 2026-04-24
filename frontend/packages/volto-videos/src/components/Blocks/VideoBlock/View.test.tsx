import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { VideoBlockView } from './View';
import type { VideoBlockData, VideoHref } from './index';

const HREF: VideoHref = {
  '@id': 'https://example.com/a-video',
  Title: 'A Video',
  title: 'A Video',
  Description: 'd',
  hasPreviewImage: false,
  image_scales: {} as unknown as VideoHref['image_scales'],
  videoUrl: 'https://www.youtube.com/watch?v=abc',
};

const baseData: VideoBlockData = {
  href: [HREF],
  align: 'center',
  size: 'l',
};

describe('VideoBlockView caption', () => {
  it('does not render caption markup when title and description are empty', () => {
    const { container } = render(<VideoBlockView data={baseData} />);
    expect(container.querySelector('.title')).toBeNull();
    expect(container.querySelector('.description')).toBeNull();
  });

  it('renders caption title and description when both are set and showCaption is true', () => {
    const { container } = render(
      <VideoBlockView
        data={{
          ...baseData,
          showCaption: true,
          title: 'The title',
          description: 'The description',
        }}
      />,
    );
    expect(container.querySelector('.title')?.textContent).toBe('The title');
    expect(container.querySelector('.description')?.textContent).toContain(
      'The description',
    );
  });

  it('renders caption when showCaption is undefined (defaults to visible)', () => {
    const { container } = render(
      <VideoBlockView data={{ ...baseData, title: 'Just a title' }} />,
    );
    expect(container.querySelector('.title')?.textContent).toBe('Just a title');
  });

  it('renders only the title when description is empty', () => {
    const { container } = render(
      <VideoBlockView data={{ ...baseData, title: 'Only title' }} />,
    );
    expect(container.querySelector('.title')?.textContent).toBe('Only title');
    expect(container.querySelector('.description')).toBeNull();
  });

  it('hides the caption when showCaption is false even if title and description are set', () => {
    const { container } = render(
      <VideoBlockView
        data={{
          ...baseData,
          showCaption: false,
          title: 'Hidden title',
          description: 'Hidden description',
        }}
      />,
    );
    expect(container.querySelector('.title')).toBeNull();
    expect(container.querySelector('.description')).toBeNull();
  });
});
