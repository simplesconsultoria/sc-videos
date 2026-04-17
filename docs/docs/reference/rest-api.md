---
myst:
  html_meta:
    "description": "Reference for the @video-metadata REST API endpoint"
    "property=og:description": "Reference for the @video-metadata REST API endpoint"
    "property=og:title": "🌐 REST API — @video-metadata"
    "keywords": "Plone, REST API, video-metadata, endpoint, sc-videos"
---

# 🌐 REST API — `@video-metadata`

The `@video-metadata` service fetches metadata for an external video URL.
It is used by the frontend `VideoURLWidget` to auto-populate content fields when an editor pastes a video URL.

**Module:** `sc.videos.services.metadata.post`
**Permission:** `sc.videos.video.add` (Add Video)

## 📤 Request

```
POST /{context}/@video-metadata
Content-Type: application/json
Accept: application/json
```

### Body

```json
{
  "videoUrl": "https://www.youtube.com/watch?v=x7QX9tQxEBc"
}
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `videoUrl` | `string` | Yes | The external video URL to fetch metadata for. |

## 📥 Response

### Success — `200 OK`

```json
{
  "service": "youtube",
  "video_id": "x7QX9tQxEBc",
  "title": "Mão na Massa: Começando um projeto com Plone 6.1",
  "text": "O Plone 6.1 já é uma realidade...",
  "duration": 3720,
  "thumbnail_url": "https://i.ytimg.com/vi/x7QX9tQxEBc/maxresdefault.jpg",
  "channel": "PloneGov-Br",
  "subjects": ["plone", "python", "web"]
}
```

| Field | Type | Description |
|---|---|---|
| `service` | `string` | Provider identifier (`youtube`, `vimeo`). |
| `video_id` | `string` | Provider-specific video ID. |
| `title` | `string` | Video title. |
| `text` | `string` | Video description. |
| `duration` | `integer` | Duration in seconds. May be `0` if the provider doesn't expose it (e.g. YouTube public oEmbed). |
| `thumbnail_url` | `string` | URL of the best available thumbnail. |
| `channel` | `string` | Channel or author name. |
| `subjects` | `string[]` | Tags/keywords associated with the video. |

### Error — `400 Bad Request`

Returned when the URL is not recognized by any registered provider.

```json
{
  "error": "Unsupported video URL"
}
```

### Error — `502 Bad Gateway`

Returned when the provider's API is unreachable or returns an unexpected response.

```json
{
  "error": "Failed to fetch video metadata from youtube"
}
```

## 🔌 Supported URL patterns

The endpoint delegates to registered `IVideoMetadataProvider` utilities.
Each provider declares a `url_pattern` regex that the service uses to match incoming URLs.

### YouTube

| Pattern | Example |
|---|---|
| `youtube.com/watch?v=ID` | `https://www.youtube.com/watch?v=x7QX9tQxEBc` |
| `youtu.be/ID` | `https://youtu.be/x7QX9tQxEBc` |
| `youtube.com/embed/ID` | `https://www.youtube.com/embed/x7QX9tQxEBc` |
| `youtube.com/shorts/ID` | `https://www.youtube.com/shorts/x7QX9tQxEBc` |
| `youtube.com/live/ID` | `https://www.youtube.com/live/ATy8ALW63rQ` |

### Vimeo

| Pattern | Example |
|---|---|
| `vimeo.com/ID` | `https://vimeo.com/110591222` |
| `player.vimeo.com/video/ID` | `https://player.vimeo.com/video/110591222` |

## 🔑 YouTube API vs public oEmbed

The service supports two modes for YouTube:

- **YouTube Data API v3** — richer metadata (description, duration, tags). Requires a Google API key configured in the {doc}`control-panel`.
- **Public oEmbed** — no API key needed, but returns limited data (no duration, description, or tags).

The mode is controlled by the `youtube_api_enabled` setting in the Video Settings control panel.
See {doc}`/how-to-guides/configure-youtube-api` for setup instructions.

Vimeo always uses the public oEmbed endpoint — no API key required.

:::{seealso}
- {doc}`/concepts/video-metadata-pipeline` — End-to-end flow from URL to content fields.
- {doc}`/concepts/provider-system` — How providers are registered and resolved.
- {doc}`control-panel` — Video Settings control panel configuration.
:::
