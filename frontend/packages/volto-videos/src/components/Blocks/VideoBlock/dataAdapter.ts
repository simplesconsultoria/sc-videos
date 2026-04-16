/**
 * Data adapter for the Video block.
 *
 * Registered on the block config and invoked by `VideoBlockEdit` when the
 * user picks a video via the in-block `VideoInput`. Shapes the object
 * browser's raw catalog item into the `VideoHref` structure the block's
 * `href` field expects; any other field falls through as a plain assignment.
 */
import type { VideoHref } from './index';

export interface VideoBlockDataAdapterArgs {
  block: string;
  data: any;
  onChangeBlock: (id: string, data: any) => void;
  id: string;
  value: any;
  item?: Record<string, any>;
}

export function videoBlockDataAdapter({
  block,
  data,
  onChangeBlock,
  id,
  value,
  item,
}: VideoBlockDataAdapterArgs): void {
  if (id === 'href' && item) {
    const href: VideoHref = {
      '@id': item['@id'],
      Title: item.Title,
      title: item.title ?? item.Title,
      Description: item.Description,
      hasPreviewImage: !!item.hasPreviewImage,
      image_scales: item.image_scales ?? {},
      videoUrl: item.videoUrl,
    };
    onChangeBlock(block, { ...data, href: [href] });
    return;
  }
  onChangeBlock(block, { ...data, [id]: value });
}
