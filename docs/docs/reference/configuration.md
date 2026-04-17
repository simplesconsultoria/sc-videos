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
| `sc.videos.video.add` | Add Video | Manager, Site Administrator, Contributor |

This permission controls who can create Video content items.
It can be customized via Plone's role/permission management.

## 📇 Catalog configuration

### Metadata columns

| Column | Source |
|---|---|
| `videoUrl` | `IRemoteVideo.videoUrl` (via indexer adapter) |

The `videoUrl` column is available in catalog search results, used by the Video block to display the video without fetching the full content object.

### Indexer

| Adapter name | Module | Description |
|---|---|---|
| `videoUrl` | `sc.videos.indexers.video.video_url` | Field indexer for the `videoUrl` field of `IRemoteVideo`. |

## 🌐 Registry settings

Settings are stored in the Plone registry under the `sc.videos` prefix.

| Key | Type | Default | Description |
|---|---|---|---|
| `sc.videos.youtube_api_enabled` | `Bool` | `False` | Enable YouTube Data API v3. |
| `sc.videos.youtube_api_key` | `TextLine` | `"default"` | Google API key for YouTube. |

See {doc}`control-panel` for the web UI and REST API access.

## 🌍 Browser layer

**Interface:** `sc.videos.interfaces.IBrowserLayer`

Registered by the default profile and removed by the uninstall profile.
Used to scope views, adapters, and other registrations to sites where sc-videos is installed.

## 📂 ZCML dependencies

sc-videos depends on the following packages (loaded via `dependencies.zcml`):

- `plone.restapi`
- `plone.volto`

:::{seealso}
- {doc}`control-panel` — The Video Settings control panel.
- {doc}`content-type` — The Video content type definition.
- {doc}`behavior` — The IRemoteVideo behavior.
:::
