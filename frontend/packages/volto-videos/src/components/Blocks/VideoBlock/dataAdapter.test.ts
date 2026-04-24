import { describe, it, expect, vi } from 'vitest';
import { videoBlockDataAdapter } from './dataAdapter';

const baseItem = {
  '@id': 'https://example.com/a-video',
  Title: 'Item title',
  title: 'item title lower',
  Description: 'Item description',
  hasPreviewImage: true,
  image_scales: { preview_image: [] },
  videoUrl: 'https://youtu.be/abc',
};

describe('videoBlockDataAdapter', () => {
  it('populates caption title and description when they are empty', () => {
    const onChangeBlock = vi.fn();
    videoBlockDataAdapter({
      block: 'block-id',
      data: { href: [], align: 'center' },
      onChangeBlock,
      id: 'href',
      value: baseItem['@id'],
      item: baseItem,
    });
    const [, patch] = onChangeBlock.mock.calls[0];
    expect(patch.title).toBe('Item title');
    expect(patch.description).toBe('Item description');
  });

  it('does not overwrite an existing caption title or description', () => {
    const onChangeBlock = vi.fn();
    videoBlockDataAdapter({
      block: 'block-id',
      data: {
        href: [],
        align: 'center',
        title: 'User title',
        description: 'User description',
      },
      onChangeBlock,
      id: 'href',
      value: baseItem['@id'],
      item: baseItem,
    });
    const [, patch] = onChangeBlock.mock.calls[0];
    expect(patch.title).toBe('User title');
    expect(patch.description).toBe('User description');
  });

  it('shapes the item into a VideoHref', () => {
    const onChangeBlock = vi.fn();
    videoBlockDataAdapter({
      block: 'block-id',
      data: { href: [], align: 'center' },
      onChangeBlock,
      id: 'href',
      value: baseItem['@id'],
      item: baseItem,
    });
    const [, patch] = onChangeBlock.mock.calls[0];
    expect(patch.href).toHaveLength(1);
    expect(patch.href[0]['@id']).toBe(baseItem['@id']);
    expect(patch.href[0].videoUrl).toBe(baseItem.videoUrl);
  });

  it('passes other field changes through as plain assignments', () => {
    const onChangeBlock = vi.fn();
    videoBlockDataAdapter({
      block: 'block-id',
      data: { href: [], align: 'center' },
      onChangeBlock,
      id: 'size',
      value: 'm',
    });
    const [, patch] = onChangeBlock.mock.calls[0];
    expect(patch.size).toBe('m');
    expect(patch).not.toHaveProperty('title');
  });
});
