---
block: video
---

Shows a video from YouTube or Vimeo in a player, with an optional caption. The block is for pages: the video is picked with the block's own object browser, and the block does not read it again when the page is rendered.

The block stores a copy of the picked `Video` item in `href`, with the caption in `title` and `description`. To change the video, pick another one.

### Fields

- `href`: a list with one object, the picked `Video` item, copied when it was picked. The block shows the first object only. Its keys are `@id` (the path or URL of the item), `Title`, `Description`, `hasPreviewImage`, `image_scales` (the image scales of the item, used for the preview image) and `videoUrl` (the URL of the video that the player loads). The block renders no player when the list is empty.
- `autoPlay`: a boolean. It is stored, but the block does not read it when it renders.
- `size`: `s`, `m` or `l`. Without a known value, the block uses `l`.
- `align`: `left`, `right`, `center`, `wide` or `full`. Without a value, the block is centered. The sidebar form stores `wide` when it opens a block without an alignment, so a block that was never opened in the sidebar is centered and one that was is shown wide.
- `showCaption`: a boolean. Without a value, or when it is `true`, the caption is shown whenever `title` or `description` has text. `false` hides the caption.
- `title`: the caption title. When a video is picked and this field is empty, it is filled with the title of the video.
- `description`: the caption description. When a video is picked and this field is empty, it is filled with the description of the video.

`theme` and `styles` come from the theme's styling schema, which is added to every block.

### Examples

```json
{ "@type": "video" }
```

```json
{
  "@type": "video",
  "href": [
    {
      "@id": "https://example.org/videos/introduction",
      "Title": "Introduction",
      "title": "Introduction",
      "Description": "A short introduction to the project.",
      "hasPreviewImage": false,
      "image_scales": {},
      "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ],
  "autoPlay": false,
  "size": "l",
  "align": "wide",
  "showCaption": true,
  "title": "Introduction",
  "description": "A short introduction to the project."
}
```

The chooser offers this block only on content that has no `videoUrl`, such as a page. On a `Video` item, use the Video Player block instead. Blocks written through the REST API are not checked against this rule.
