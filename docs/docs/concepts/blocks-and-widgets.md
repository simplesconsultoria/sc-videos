---
myst:
  html_meta:
    "description": "Understanding blocks and widgets in sc-videos — when to use which"
    "property=og:description": "Understanding blocks and widgets in sc-videos — when to use which"
    "property=og:title": "🧱 Blocks and widgets"
    "keywords": "Plone, Volto, blocks, widgets, VideoBlock, VideoPlayerBlock, sc-videos"
---

# 🧱 Blocks and widgets

sc-videos provides two distinct blocks and several widgets.
This page explains the differences and when to use each.

## 📊 Two blocks, two use cases

| | Video Player block | Video block |
|---|---|---|
| **Purpose** | Play the video that *is* this content | Embed a video from *elsewhere* in the site |
| **Where it appears** | Video content pages only | Any content type with blocks |
| **URL source** | Parent content's `videoUrl` field | Referenced Video's catalog metadata |
| **Data model** | Reads from `properties` (content fields) | Stores `href[]` in block data |
| **Edit affordance** | In-block `VideoURLWidget` + fetch | In-block `VideoInput` (object browser) |
| **Grid support** | No | Yes |

### When to use the Video Player block

Use the Video Player block when you're editing a **Video content item** and want to display its video.
This block is pre-configured in the Video content type's default layout — you don't need to add it manually.

The block reads the video URL from the content's `videoUrl` field (via the `IRemoteVideo` behavior) and renders the player.
Changes to the URL update the content, not block data.

### When to use the Video block

Use the Video block when you want to embed a video on a **non-Video page** (a Document, a News Item, an Event, etc.).
The block lets you pick an existing Video content item via the object browser.

The block stores a reference to the Video in its own `href[]` block data.
The same Video can be embedded on multiple pages.

## 🔧 Widget roles

### VideoURLWidget

The **main editing widget** for the `videoUrl` field.
Appears in two places:

1. **Content type sidebar** — Volto's form engine renders it automatically for the `videoUrl` field (because the backend's JSON schema provider returns `widget: "VideoURL"`).
2. **In-block EditForm** — the Video Player block's edit mode embeds it directly in the block area for a more prominent editing experience.

Both instances bind to the same content field (`properties.videoUrl`) via `onChangeField`, so they stay in sync.

### VideoMetadataWidget

A **hidden widget** for the `_metadata` JSON field.
It stores the raw metadata returned by the provider.
Renders no visible UI — it's purely a data carrier used by the event subscribers and the metadata preview.

### VideoInput

An **in-block placeholder** component (not a form widget).
Used by the Video block to let editors pick a Video from the object browser.
It opens the browser filtered to `Video` content only and calls the block's `dataAdapter` when an item is selected.

## 🔄 How they connect

```{mermaid}
flowchart TD
    subgraph "Video content page"
        A["VideoPlayerBlock (Edit)"]
        B["EditForm"]
        C["VideoURLWidget"]
        D["Content sidebar"]
        E["VideoURLWidget (sidebar)"]
        A --> B
        B --> C
        D --> E
        C -.->|"onChangeField('videoUrl')"| E
    end

    subgraph "Any other page"
        F["VideoBlock (Edit)"]
        G["VideoInput"]
        H["Object Browser"]
        I["dataAdapter"]
        F --> G
        G --> H
        H --> I
        I -->|"onChangeBlock(block, {href: [...]})"| F
    end
```

:::{seealso}
- {doc}`/reference/blocks` — Full technical reference for both blocks.
- {doc}`/reference/widgets` — Props and behavior for all widgets.
- {doc}`/tutorials/create-a-video` — Hands-on tutorial for the Video Player block.
- {doc}`/tutorials/embed-video-in-page` — Hands-on tutorial for the Video block.
:::
