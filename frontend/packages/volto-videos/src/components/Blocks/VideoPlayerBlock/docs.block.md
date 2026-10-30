---
block: playerBlock
---

Shows the video of the `Video` item being viewed, in a player from YouTube or Vimeo. It is meant for `Video` items, which have a video of their own.

The block stores none of the video details. It reads the video URL, the title and the preview image from the item when the page is rendered, so to change the video, change the item.

### Fields

- `autoPlay`: a boolean. It is stored, but the block does not read it when it renders.
- `size`: `s`, `m` or `l`. Without a known value, the block uses `l`.
- `align`: `left`, `right`, `center`, `wide` or `full`. Without a value, the block is centered. The sidebar form stores `wide` when it opens a block without an alignment, so a block that was never opened in the sidebar is centered and one that was is shown wide.

`theme` and `styles` come from the theme's styling schema, which is added to every block.

### Examples

```json
{ "@type": "playerBlock" }
```

```json
{
  "@type": "playerBlock",
  "autoPlay": false,
  "size": "l",
  "align": "wide"
}
```

The chooser offers this block only on content that has a `videoUrl`, such as a `Video` item. Blocks written through the REST API are not checked against this rule.
