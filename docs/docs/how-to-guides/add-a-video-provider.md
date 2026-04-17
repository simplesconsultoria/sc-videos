---
myst:
  html_meta:
    "description": "How to add a new video provider to sc-videos (backend + frontend)"
    "property=og:description": "How to add a new video provider to sc-videos (backend + frontend)"
    "property=og:title": "🔌 Add a new video provider"
    "keywords": "Plone, video provider, extensible, IVideoMetadataProvider, sc-videos"
---

# 🔌 Add a new video provider

sc-videos is designed to be extensible.
This guide walks you through adding support for a new video hosting service. from backend provider to frontend embed support.

We'll use **Dailymotion** as an example.

## 🔧 Backend: Implement the provider

### 1. Create the client

Create a module for your provider's HTTP client:

```python
# src/my_addon/integration/dailymotion/public.py
from sc.videos.integration.base import BaseClient
from sc.videos.integration.base import VideoMetadata


class DailymotionPublicClient(BaseClient):
    """Fetch metadata from Dailymotion's oEmbed endpoint."""

    BASE_URL = "https://www.dailymotion.com/services/oembed"

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        url = f"https://www.dailymotion.com/video/{video_id}"
        data = self.get("", params={"url": url, "format": "json"})
        return VideoMetadata(
            video_id=video_id,
            title=data.get("title", ""),
            description=data.get("description", ""),
            duration=int(data.get("duration", 0)),
            thumbnail_url=data.get("thumbnail_url", ""),
            channel=data.get("author_name", ""),
            tags=[],
        )
```

### 2. Create the provider

```python
# src/my_addon/integration/dailymotion/__init__.py
import re

from sc.videos.integration.base import MetadataProvider

from .public import DailymotionPublicClient


class DailymotionMetadataProvider(MetadataProvider):
    """Metadata provider for Dailymotion videos."""

    id = "dailymotion"
    name = "Dailymotion"
    url_pattern = re.compile(
        r"(?:dailymotion\.com/video/|dai\.ly/)([a-zA-Z0-9]+)"
    )

    def _get_client(self):
        return DailymotionPublicClient(base_url=self.BASE_URL)
```

### 3. Register the utility

```xml
<!-- configure.zcml -->
<utility
    factory=".integration.dailymotion.DailymotionMetadataProvider"
    provides="sc.videos.interfaces.IVideoMetadataProvider"
    name="dailymotion"
    />
```

That's it for the backend.
The URL will now be recognized by `resolve_url()`, the vocabulary will include "dailymotion", and the `@video-metadata` service will fetch Dailymotion metadata.

## 🎨 Frontend: Register the provider

The frontend uses `@plone/registry` utilities, so you don't need to modify any sc-videos source files.

### 4. Create the provider object

In your add-on, create a provider that implements the `VideoProvider` interface:

```typescript
// src/providers/dailymotion.ts
import type { VideoProvider } from '@simplesconsultoria/volto-videos/types/videoPlayer';

const dailymotionProvider: VideoProvider = {
  id: 'dailymotion',
  name: 'Dailymotion',
  urlPattern: /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/,

  getDefaultThumbnail(videoId: string): string {
    return `https://www.dailymotion.com/thumbnail/video/${videoId}`;
  },

  getEmbedUrl(videoId: string, autoplay: boolean): string {
    const ap = autoplay ? 1 : 0;
    return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=${ap}`;
  },
};

export default dailymotionProvider;
```

### 5. Register the provider utility

In your add-on's `applyConfig`, register the provider:

```typescript
// src/index.ts
import type { ConfigType } from '@plone/registry';
import dailymotionProvider from './providers/dailymotion';

function applyConfig(config: ConfigType) {
  config.registerUtility({
    name: 'dailymotion',
    type: 'videoProvider',
    method: () => dailymotionProvider,
  });

  return config;
}

export default applyConfig;
```

That's it. The `resolveVideo()`, `getDefaultThumbnail()`, and `getEmbedUrl()` helpers automatically discover your provider from the registry at runtime.

### 6. Add Storybook MSW handlers (optional)

Add mock metadata for your provider in `src/mocks/videoMetadata.ts` so stories can exercise the new source without hitting the real API.

## ✅ Test

1. Restart the backend (ZCML changes require a restart).
2. Create a Video and paste a Dailymotion URL.
3. Click the fetch button. metadata should populate.
4. Save. the player should embed the Dailymotion video.

:::{seealso}
- {doc}`/concepts/provider-system`. Architecture of the provider system.
- {doc}`/reference/rest-api`. The `@video-metadata` endpoint.
:::
