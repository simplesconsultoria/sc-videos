---
myst:
  html_meta:
    "description": "How the video metadata pipeline works — from URL to content fields"
    "property=og:description": "How the video metadata pipeline works — from URL to content fields"
    "property=og:title": "🔄 The video metadata pipeline"
    "keywords": "Plone, metadata, pipeline, video, sc-videos, YouTube, Vimeo"
---

# 🔄 The video metadata pipeline

When an editor pastes a video URL, sc-videos fetches structured metadata from the external provider and populates the content's fields automatically.
This page explains the end-to-end flow.

## 🔗 The pipeline at a glance

```{mermaid}
flowchart LR
    A["Editor pastes URL"] --> B["VideoURLWidget"]
    B -->|POST| C["@video-metadata"]
    C --> D["resolve_url()"]
    D --> E["IVideoMetadataProvider"]
    E -->|HTTP| F["External API"]
    F --> E
    E --> C
    C -->|JSON| B
    B --> G["applyVideoMetadataToForm()"]
    G --> H["Content fields updated"]
    H --> I["Event subscriber"]
    I --> J["Preview image downloaded"]
```

## 1️⃣ URL entry (frontend)

The editor pastes a URL into the `VideoURLWidget` — either in the content type's sidebar form or in the Video Player block's in-block edit form.

The widget does **not** validate the URL against providers on the frontend.
It sends the URL as-is to the backend when the editor clicks the arrow (→) button.

## 2️⃣ URL resolution (backend)

The `@video-metadata` service calls `resolve_url(url)`:

1. Iterates over all registered `IVideoMetadataProvider` utilities (loaded via `get_video_services()`).
2. Tests the URL against each provider's `url_pattern` regex.
3. On first match, extracts the `video_id` capture group.
4. Returns a `VideoReference(service, video_id)` tuple.

If no provider matches, the service returns a `400 Bad Request` error.

## 3️⃣ Metadata fetching (backend)

With the `VideoReference` in hand, the service looks up the named utility for the matched service and calls `fetch_metadata(video_id)`.

Each provider uses an HTTP client to call the external API:

- **YouTube API client** — calls the YouTube Data API v3 (requires an API key).
- **YouTube public client** — calls the oEmbed endpoint (no key, limited data).
- **Vimeo public client** — calls the Vimeo oEmbed endpoint.

The client returns a `VideoMetadata` dataclass:

```python
@dataclass(frozen=True)
class VideoMetadata:
    video_id: str
    title: str
    description: str
    duration: int          # seconds (0 if unavailable)
    thumbnail_url: str
    channel: str
    tags: list[str]
```

## 4️⃣ Response (backend → frontend)

The service serializes `VideoMetadata` to JSON and returns it.
The response is documented in {doc}`/reference/rest-api`.

## 5️⃣ Form population (frontend)

The `VideoURLWidget` receives the JSON response and calls `applyVideoMetadataToForm()`:

1. Writes the full metadata object to `_metadata` (always).
2. For each mapped field (`title`, `description`, `duration`, `channel`, `subjects`, `video_id`, `service`), writes the value **only if the field is currently empty** on the form — so editor customizations are never overwritten.

## 6️⃣ Content save → event subscribers (backend)

When the editor saves the content, Plone's `IObjectAddedEvent` or `IObjectModifiedEvent` fires.
The event subscriber:

1. Reads the `_metadata` JSON field from the content.
2. Copies `duration`, `channel`, `video_id`, and `service` into their respective schema fields (if changed).
3. Downloads the thumbnail image from `thumbnail_url` and stores it as `preview_image` (only if the content doesn't already have a preview image).

This ensures the content object's fields are always in sync with the stored metadata, even if the content was created via the REST API without using the frontend widget.

## ⚠️ Error handling

| Scenario | Backend response | Frontend behavior |
|---|---|---|
| URL doesn't match any provider | `400 Bad Request` | Error message below the input |
| Provider API unreachable | `502 Bad Gateway` | Error message below the input |
| Network failure (fetch to backend) | — | "Failed to connect" message |
| Thumbnail download fails (on save) | Logged as warning | Content saved without preview image |

:::{seealso}
- {doc}`provider-system` — How providers are registered and how to add new ones.
- {doc}`/reference/rest-api` — Full API reference for the `@video-metadata` endpoint.
- {doc}`/reference/behavior` — The `IRemoteVideo` behavior fields that receive the metadata.
:::
