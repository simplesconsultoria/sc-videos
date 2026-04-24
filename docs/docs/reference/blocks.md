---
myst:
  html_meta:
    "description": "Reference for the Volto blocks. Video Player block and Video block"
    "property=og:description": "Reference for the Volto blocks. Video Player block and Video block"
    "property=og:title": "🧱 Volto blocks"
    "keywords": "Plone, Volto, blocks, Video Player, Video block, sc-videos"
---

# 🧱 Volto blocks

sc-videos registers two Volto blocks.
They serve different purposes and appear in different contexts.

## 🎬 Video Player block

The Video Player block is designed for the **Video content type page**.
It reads the video URL directly from the parent content's `videoUrl` field (set via the {doc}`behavior`), not from block data.

| Property | Value |
|---|---|
| Block ID | `playerBlock` |
| Title | Video Player |
| Group | `video` |
| Icon | `videocamera.svg` |
| Restriction | Only on `Video` content |
| Sidebar tab | 1 |

### Schema

| Field | Widget | Default | Description |
|---|---|---|---|
| `autoPlay` | Boolean | `false` | Start the video automatically on page load. |
| `size` | `image_size` | `l` | Player width: `s` (small), `m` (medium), `l` (large). |
| `align` | `align` | `wide` | Horizontal alignment: left, right, center, wide, full. |

### Edit behavior

When the parent Video content has **no `videoUrl` yet**:

1. The block renders an **EditForm**: an in-block placeholder that embeds the `VideoURLWidget`.
2. The editor pastes a URL and clicks the arrow button to fetch metadata.
3. After a successful metadata fetch (`_metadata` is populated), the block transitions to the player view.

When `videoUrl` is already set (existing content):

1. The block renders the embedded video player.
2. The sidebar shows the schema fields (autoPlay, size, align).

### Data flow

The Video Player block does **not** store the video URL in block data.
It uses Volto's `properties` (parent content fields) and `onChangeField` to read and write the URL.

```
properties.videoUrl → VideoPlayerBlock View → VideoPlayer component
                    ↑
EditForm → VideoURLWidget → onChangeField('videoUrl', url)
```

## 📺 Video block

The Video block is for embedding an **existing Video content item** in any page. Documents, News Items, or any content type with Volto blocks support.

| Property | Value |
|---|---|
| Block ID | `video` |
| Title | Video |
| Group | `video` |
| Icon | `videocamera.svg` |
| Restriction | Not on `Video` content (complementary to Video Player) |
| Sidebar tab | 1 |
| Grid support | Yes (registered in `gridBlock.allowedBlocks`) |

### Schema

| Field | Widget | Default | Description |
|---|---|---|---|
| `href` | `object_browser` (mode: `link`) |. | Reference to a Video content item. Fetches `Title`, `Description`, `hasPreviewImage`, `videoUrl` as selected attributes. |
| `autoPlay` | Boolean | `false` | Start the video automatically. |
| `size` | `image_size` | `l` | Player width. |
| `align` | `align` |. | Horizontal alignment. |
| `showCaption` | Boolean | `true` | When `true` and at least one caption field is populated, render the caption below the player. |
| `title` | Text | -- | Caption title. Rendered as `<strong class="title">` by the `Caption` component. |
| `description` | `textarea` | -- | Plain-text caption description. Line breaks are preserved and rendered as `<p>` elements. |

The caption is rendered using the `Caption` component from `@kitconcept/volto-light-theme` as a `<figcaption>` inside the player's `<figure>`, and appears only when `showCaption` is `true` and either `title` or `description` has content.

### Data adapter

When an editor picks a video via the object browser or the in-block `VideoInput`, the block's `dataAdapter` shapes the catalog item into the `href[]` structure:

```typescript
interface VideoHref {
  '@id': string;        // Content URL
  Title: string;        // Uppercase (catalog metadata)
  title: string;        // Lowercase (ObjectBrowserWidget display)
  Description: string;
  hasPreviewImage: boolean;
  image_scales: ImageScalesSummary;
  videoUrl: string;     // External video URL
}
```

The `title` (lowercase) field is required by Volto's `ObjectBrowserWidget` to display the selected item label in the sidebar.

When a video is selected (via either the in-block picker or the sidebar object browser), the caption `title` and `description` are populated from the item's `Title` and `Description`, but only when those fields are currently empty, so editor overrides are never overwritten.

### Edit behavior

When **no video is selected** (`data.href` is empty):

1. The block renders a `VideoInput` placeholder with a browse button.
2. Clicking the button opens the object browser, filtered to `Video` content only.
3. On selection, the `dataAdapter` commits the picked item to `data.href[]`.

When a video is selected:

1. The block renders the embedded player with the video's preview image and title.
2. The sidebar shows the schema fields.

## 🎨 Styling schema enhancer

Both blocks share a `videoSchemaEnhancer` that adds the alignment schema to the block's style fieldset.
The available alignment options are: `left`, `right`, `center`, `wide`, `full`.

The `defaultStylingSchema` from `@kitconcept/volto-light-theme` is also composed in, providing theme selection support.

:::{seealso}
- {doc}`widgets`. The widgets used by these blocks (VideoURLWidget, VideoInput).
- {doc}`/concepts/blocks-and-widgets`. When to use each block.
- {doc}`css-variables`. CSS custom properties for player theming.
:::
