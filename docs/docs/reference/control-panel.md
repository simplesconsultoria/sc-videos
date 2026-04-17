---
myst:
  html_meta:
    "description": "Reference for the Video Settings control panel"
    "property=og:description": "Reference for the Video Settings control panel"
    "property=og:title": "⚙️ Video Settings control panel"
    "keywords": "Plone, control panel, settings, YouTube API, sc-videos"
---

# ⚙️ Video Settings control panel

The Video Settings control panel configures global options for the sc-videos add-on.

**Interface:** `sc.videos.controlpanels.interfaces.ISCVideoSettings`
**Registry prefix:** `sc.videos`
**Category:** Products
**REST API endpoint:** `/@controlpanels/video_settings`

## 🏷️ Settings

| Field | Type | Default | Description |
|---|---|---|---|
| `youtube_api_enabled` | Boolean | `False` | When enabled, sc-videos uses the YouTube Data API v3 for metadata fetching. When disabled, it uses the public oEmbed endpoint (limited data). |
| `youtube_api_key` | Text | `"default"` | The Google API key for the YouTube Data API v3. Only used when `youtube_api_enabled` is `True`. |

## 🌐 Accessing via REST API

```
GET /@controlpanels/video_settings
Accept: application/json
```

```json
{
  "@id": "http://localhost:8080/Plone/@controlpanels/video_settings",
  "title": "Video Settings",
  "group": "Products",
  "schema": {
    "fieldsets": [
      {
        "id": "default",
        "title": "Default",
        "fields": ["youtube_api_enabled", "youtube_api_key"]
      }
    ]
  },
  "data": {
    "youtube_api_enabled": false,
    "youtube_api_key": "default"
  }
}
```

:::{seealso}
- {doc}`/how-to-guides/configure-youtube-api` — Step-by-step setup guide.
- {doc}`/concepts/provider-system` — How the setting affects client selection.
:::
