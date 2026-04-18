---
myst:
  html_meta:
    "description": "Reference for the Video content type. FTI, behaviors, permissions"
    "property=og:description": "Reference for the Video content type. FTI, behaviors, permissions"
    "property=og:title": "📄 Video content type"
    "keywords": "Plone, content type, Video, Dexterity, FTI, sc-videos"
---

# 📄 Video content type

The **Video** content type is a Dexterity container for external videos hosted on platforms like YouTube and Vimeo.

**Factory:** `sc.videos.content.video.Video`
**Schema:** `sc.videos.content.video.IVideo`
**Permission:** `sc.videos.video.add` (Add Video)

## 🏷️ Type definition

| Property | Value |
|---|---|
| Portal type | `Video` |
| Meta type | `Dexterity Container` |
| Global allow | `True` |
| Allowed child types | `Image` |
| Filter content types | `True` |
| Discussion enabled | `True` |
| Versioning | `True` |
| Default view | `view` |

## 🧩 Applied behaviors

The Video content type includes the following behaviors:

| Behavior | Description |
|---|---|
| `plone.basic` | Title and description fields. |
| `sc.videos.remotevideo` | Video URL, metadata, and provider fields. See {doc}`behavior`. |
| `plone.namefromtitle` | Automatically generate the content ID from the title. |
| `volto.blocks` | Volto blocks support for the content area. |
| `volto.preview_image` | Preview image field (autopopulated from video thumbnail). |
| `plone.categorization` | Subject/tags and related items. |
| `volto.navtitle` | Navigation title override. |
| `plone.versioning` | Content versioning. |
| `plone.excludefromnavigation` | Exclude from navigation option. |
| `plone.shortname` | Short name (URL slug) editing. |

## 📐 Default blocks layout

When a new Video is created, it starts with the following blocks:

1. **Title block**: displays the content title.
2. **Description block**: displays the content description.
3. **Video Player block**: shows the in-block edit form for entering a video URL; switches to the embedded player after metadata is fetched.
4. **Slate block**: an empty rich text block for additional content.

This layout is configured in `config/blocks.ts`:

```typescript
config.blocks.initialBlocks.Video = [
  { '@type': 'title' },
  { '@type': 'description' },
  { '@type': 'playerBlock', autoPlay: false, size: 'l', theme: 'grey', align: 'wider' },
  { '@type': 'slate' },
];
```

## 🔐 Permissions

| Permission | Title | Default roles |
|---|---|---|
| `sc.videos.video.add` | Add Video | Manager, Site Administrator, Contributor |

## 📇 Catalog metadata

The Video content type exposes the following columns and indexes in the portal catalog:

| Column | Source | Description |
|---|---|---|
| `videoUrl` | `IRemoteVideo.videoUrl` | The external video URL. Available in search results without fetching the full object. |
| `duration` | `IRemoteVideo.duration` | Video duration in seconds. Also available as a `FieldIndex` for range queries. |
| `has_video` | `IRemoteVideo` presence | `True` for any content providing `IRemoteVideo`. Also available as a `BooleanIndex`. |

These columns are used by blocks to display video information from catalog search results.
See {doc}`configuration` for the full list of indexes, querystring fields, and the duration range vocabulary.

## 📺 VideoSeries content type

The **VideoSeries** content type is a container for organizing Episodes into a series.

| Property | Value |
|---|---|
| Portal type | `VideoSeries` |
| Title | Series |
| Global allow | `True` (controlled by `enable_series` setting via permission) |
| Filter content types | `False` |
| Add permission | `sc.videos.videoseries.add` |

VideoSeries is not creatable by default. Enable it via the `enable_series` toggle in the {doc}`control-panel`.
When a VideoSeries is created, a subscriber grants the Episode add permission locally, so Episodes can only be created inside a VideoSeries.

## 🎬 Episode content type

The **Episode** content type represents a single video episode within a VideoSeries.

| Property | Value |
|---|---|
| Portal type | `Episode` |
| Global allow | `True` (but add permission not granted globally) |
| Filter content types | `True` |
| Allowed child types | `Image` |
| Add permission | `sc.videos.episode.add` |

Episode applies the `IRemoteVideo` behavior, so it inherits all video fields (URL, duration, metadata) and the automatic metadata fetching pipeline.
It also has a `start` field (`Datetime`) for the episode release date.

:::{seealso}
- {doc}`behavior`. The `IRemoteVideo` behavior and its fields.
- {doc}`blocks`. The Video Player and Video blocks.
- {doc}`/concepts/architecture`. How the content type fits into the overall system.
- {doc}`configuration`. Permissions, registry settings, and catalog indexes.
:::
