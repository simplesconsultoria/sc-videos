---
myst:
  html_meta:
    "description": "The extensible video provider system. IVideoMetadataProvider, utilities, clients"
    "property=og:description": "The extensible video provider system. IVideoMetadataProvider, utilities, clients"
    "property=og:title": "🔌 The provider system"
    "keywords": "Plone, provider, IVideoMetadataProvider, YouTube, Vimeo, extensible, sc-videos"
---

# 🔌 The provider system

sc-videos uses an extensible provider architecture based on Zope's component architecture.
Each video hosting service (YouTube, Vimeo, etc.) is a **named utility** that implements the `IVideoMetadataProvider` interface.

## 🧩 The `IVideoMetadataProvider` interface

**Module:** `sc.videos.interfaces`

```python
class IVideoMetadataProvider(Interface):
    """A utility that can resolve and fetch metadata for a video service."""

    id = Attribute("Machine-readable service identifier")
    name = Attribute("Human-readable display name")
    url_pattern = Attribute("Compiled regex with a capture group for video ID")

    def fetch_metadata(video_id: str) -> VideoMetadata:
        """Fetch metadata for a video by its provider-specific ID."""
```

Each provider carries a `url_pattern`. a compiled regular expression with a capture group that extracts the video ID from a URL.
This makes `resolve_url()` fully extensible: adding a new provider is just registering a new named utility.

## 🏭 Built-in providers

### YouTube

**Utility name:** `youtube`
**Module:** `sc.videos.integration.youtube`

Matches these URL patterns:

- `youtube.com/watch?v=ID`
- `youtu.be/ID`
- `youtube.com/embed/ID`
- `youtube.com/shorts/ID`
- `youtube.com/live/ID`

Has two HTTP clients:

| Client | Module | API key required | Data richness |
|---|---|---|---|
| `YouTubeAPIClient` | `sc.videos.integration.youtube.api` | Yes | Full (title, description, duration, tags, thumbnail) |
| `YouTubePublicClient` | `sc.videos.integration.youtube.public` | No | Limited (title, thumbnail only) |

The provider selects the client based on the `youtube_api_enabled` setting in the {doc}`/reference/control-panel`.

### Vimeo

**Utility name:** `vimeo`
**Module:** `sc.videos.integration.vimeo`

Matches these URL patterns:

- `vimeo.com/ID`
- `player.vimeo.com/video/ID`

Uses a single client:

| Client | Module | API key required | Data richness |
|---|---|---|---|
| `VimeoPublicClient` | `sc.videos.integration.vimeo.public` | No | Full (title, description, duration, thumbnail, channel) |

## 🔍 URL resolution flow

When `resolve_url(url)` is called:

1. `get_video_services()` queries the component registry for all `IVideoMetadataProvider` utilities.
2. For each provider, the URL is tested against `provider.url_pattern`.
3. The first match wins. the regex's capture group extracts the `video_id`.
4. Returns a `VideoReference(service=provider.id, video_id=video_id)`.

```{mermaid}
flowchart TD
    A["resolve_url('https://youtu.be/abc123')"] --> B["get_video_services()"]
    B --> C["YouTubeProvider.url_pattern.search()"]
    C -->|match| D["VideoReference('youtube', 'abc123')"]
    B --> E["VimeoProvider.url_pattern.search()"]
    E -->|no match| F["skip"]
```

## 🔗 Dynamic vocabulary

The `sc.videos.vocabulary.video_services` vocabulary is automatically generated from the registered providers.
It's used by the `service` field on the `IRemoteVideo` behavior.
Adding a new provider utility automatically adds it to the vocabulary. no extra registration needed.

## 🖥️ Frontend provider registry

The frontend mirrors the backend's extensible pattern using `@plone/registry` utilities.

### The `VideoProvider` interface

**Module:** `@simplesconsultoria/volto-videos/types/videoPlayer`

```typescript
export interface VideoProvider {
  id: string;          // matches backend IVideoMetadataProvider.id
  name: string;        // human-readable display name
  urlPattern: RegExp;  // regex with capture group for video ID
  getDefaultThumbnail(videoId: string): string;
  getEmbedUrl(videoId: string, autoplay: boolean): string;
}
```

### Registration

Providers are registered as `videoProvider` utilities in `applyConfig`:

```typescript
import config from '@plone/registry';

config.registerUtility({
  name: 'youtube',
  type: 'videoProvider',
  method: () => youtubeProvider,
});
```

### Resolution

The helpers in `@simplesconsultoria/volto-videos/helpers/video` query the registry at runtime:

1. `getVideoProviders()` calls `config.getUtilities({ type: 'videoProvider' })` and maps each result through its `method()`.
2. `resolveVideo(url)` iterates all providers, testing the URL against each `urlPattern`.
3. `getDefaultThumbnail(info)` and `getEmbedUrl(info, autoplay)` find the matching provider by `id`.

Third-party add-ons register new providers without patching any sc-videos module.

## 🧱 Class hierarchy

```text
Backend:
  IVideoMetadataProvider (interface)
  └── MetadataProvider (base class)
      ├── YouTubeMetadataProvider
      └── VimeoMetadataProvider

  BaseClient (HTTP wrapper)
  ├── YouTubeAPIClient
  ├── YouTubePublicClient
  └── VimeoPublicClient

Frontend:
  VideoProvider (interface)
  ├── youtubeProvider
  └── vimeoProvider
```

`MetadataProvider` handles common logic (url_pattern matching, client instantiation).
`BaseClient` provides a shared `get(path, params)` method using `httpx`.

:::{seealso}
- {doc}`/how-to-guides/add-a-video-provider`. Step-by-step guide to implementing a new provider.
- {doc}`video-metadata-pipeline`. How the provider fits into the overall metadata flow.
- {doc}`/reference/rest-api`. The REST endpoint that invokes the provider.
:::
