---
myst:
  html_meta:
    "description": "Reference for GenericSetup profiles, registry settings, and permissions"
    "property=og:description": "Reference for GenericSetup profiles, registry settings, and permissions"
    "property=og:title": "⚙️ Configuration"
    "keywords": "Plone, GenericSetup, configuration, permissions, sc-videos"
---

# ⚙️ Configuration

This page documents the GenericSetup profiles, Plone registry settings, and permissions provided by sc-videos.

## 📦 GenericSetup profiles

| Profile | ID | Description |
|---|---|---|
| **Default** | `sc.videos:default` | Main installation profile. Registers the Video content type, catalog indexes/columns, control panel, and permissions. |
| **Initial content** | `sc.videos:initial` | Creates example Video content items using `plone.exportimport`. Run automatically on first install. |
| **Uninstall** | `sc.videos:uninstall` | Removes the browser layer. Hidden from the add-ons control panel. |

## 🔐 Permissions

| Permission ID | Title | Default roles |
|---|---|---|
| `sc.videos.video.add` | Add Video | Manager, Site Administrator, Editor, Contributor |
| `sc.videos.videoseries.add` | Add VideoSeries | None (controlled via `enable_series` setting) |
| `sc.videos.episode.add` | Add Episode | None (granted locally on VideoSeries creation) |

The Video permission controls who can create Video content items.
The VideoSeries permission is managed by the `enable_series` registry setting: when enabled, the setting grants the permission to default roles on the portal.
The Episode permission is granted locally inside each VideoSeries container by a creation subscriber.

## 📇 Catalog configuration

### Indexes

| Index | Type | Adapter | Description |
|---|---|---|---|
| `duration` | `FieldIndex` | `sc.videos.indexers.video.duration` | Video duration in seconds. Supports range queries. |
| `has_video` | `BooleanIndex` | `sc.videos.indexers.video.has_video` | `True` for any content providing `IRemoteVideo`. Works across all content types. |
| `videoseries` | `FieldIndex` | `sc.videos.indexers.videoseries.videoseries` | UUID of the nearest parent VideoSeries. Indexed on Episodes only. |

### Metadata columns

| Column | Source |
|---|---|
| `videoUrl` | `IRemoteVideo.videoUrl` (via indexer adapter) |
| `duration` | `IRemoteVideo.duration` (via indexer adapter) |
| `has_video` | `True` when content provides `IRemoteVideo` |

These columns are available in catalog search results (brain attributes), allowing templates and blocks to display video information without waking the full content object.

### Indexer adapters

| Adapter name | Module | Description |
|---|---|---|
| `videoUrl` | `sc.videos.indexers.video.video_url` | Returns the `videoUrl` field value. |
| `duration` | `sc.videos.indexers.video.duration` | Returns video duration in seconds. |
| `has_video` | `sc.videos.indexers.video.has_video` | Returns `True` if the object provides `IRemoteVideo`. Registered for `Interface`, so it indexes all content types. |
| `videoseries` | `sc.videos.indexers.videoseries.videoseries` | Traverses ancestors to return the UUID of the nearest parent VideoSeries. Registered for `IEpisode`. |

## 🔍 Querystring fields

sc-videos registers querystring fields so that Collection and Listing blocks can filter by video attributes.
All fields appear in the **Video** group in the querystring editor.

| Field | Index | Operations | Description |
|---|---|---|---|
| Video duration | `duration` | Equals, Less than, Larger than | Filter by exact duration in seconds. Sortable. |
| Video duration range | `duration_range` | Matches any of, Matches none of | Filter by duration bucket using the `sc.videos.vocabulary.duration_ranges` vocabulary. |
| Has video | `has_video` | Yes, No | Filter content by whether it has a video attached. |
| Series | `videoseries` | Matches any of, Matches none of | Filter Episodes by their parent VideoSeries. Uses the `sc.videos.vocabulary.series` vocabulary. |

### Duration range vocabulary

The `sc.videos.vocabulary.duration_ranges` vocabulary provides human-readable duration buckets for the **Video duration range** querystring field:

| Token | Label | Duration (seconds) |
|---|---|---|
| `0-10` | 0-10 minutes | 0 -- 600 |
| `11-30` | 11-30 minutes | 601 -- 1,800 |
| `31-60` | 31-60 minutes | 1,801 -- 3,600 |
| `60+` | > 60 minutes | 3,601+ |

When a user selects a duration range, the `duration_modifier` (`IParsedQueryIndexModifier`) translates it into a catalog range query against the `duration` index.

## 🌐 Registry settings

Settings are stored in the Plone registry under the `sc.videos` prefix.

| Key | Type | Default | Description |
|---|---|---|---|
| `sc.videos.enable_series` | `Bool` | `False` | Enable VideoSeries and Episode content types. When enabled, grants the VideoSeries add permission on the portal. |
| `sc.videos.youtube_api_enabled` | `Bool` | `False` | Enable YouTube Data API v3. |
| `sc.videos.youtube_api_key` | `TextLine` | `"default"` | Google API key for YouTube. |

See {doc}`control-panel` for the web UI and REST API access.

## ⚛️ Frontend settings

Frontend configuration is grouped under `config.settings.voltoVideos` in the `@plone/registry` runtime configuration.
Integrators can override these values from their own `applyConfig` function.

### `voltoVideos.description`

Controls how long video descriptions returned by the metadata pipeline are truncated before being written into form fields by `applyVideoMetadataToForm` (used by the VideoURLWidget "fetch metadata" action).

| Key | Type | Default | Description |
|---|---|---|---|
| `voltoVideos.description.maxLength` | `number` | `150` | Maximum length (in characters) of the description after metadata population. |
| `voltoVideos.description.ellipsis` | `string` | `"..."` | Suffix appended when the description is truncated. Counts against `maxLength`. |

Example override:

```ts
import type { ConfigType } from '@plone/registry';

export default function applyConfig(config: ConfigType) {
  config.settings.voltoVideos.description.maxLength = 280;
  config.settings.voltoVideos.description.ellipsis = '…';
  return config;
}
```

Types are declared via module augmentation on `@plone/types`' `SettingsConfig`, so TypeScript will catch typos and type mismatches on these keys.

## 🌍 Browser layer

**Interface:** `sc.videos.interfaces.IBrowserLayer`

Registered by the default profile and removed by the uninstall profile.
Used to scope views, adapters, and other registrations to sites where sc-videos is installed.

## 📂 ZCML dependencies

sc-videos depends on the following packages (loaded via `dependencies.zcml`):

- `plone.restapi`
- `plone.volto`

:::{seealso}
- {doc}`control-panel`. The Video Settings control panel.
- {doc}`content-type`. The Video content type definition.
- {doc}`behavior`. The IRemoteVideo behavior.
:::
