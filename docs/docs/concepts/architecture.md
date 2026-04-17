---
myst:
  html_meta:
    "description": "Architecture overview of sc-videos. monorepo layout, backend/frontend data flow"
    "property=og:description": "Architecture overview of sc-videos. monorepo layout, backend/frontend data flow"
    "property=og:title": "🏗️ Architecture overview"
    "keywords": "Plone, architecture, monorepo, sc-videos, backend, frontend, Volto"
---

# 🏗️ Architecture overview

sc-videos is a **monorepo add-on** for Plone 6.1+.
It consists of two packages that are developed, versioned, and released together:

| Package | Registry | Language | Path |
|---|---|---|---|
| `sc.videos` | PyPI | Python | `backend/` |
| `@simplesconsultoria/volto-videos` | npm | TypeScript/React | `frontend/packages/volto-videos/` |

Both packages must be installed in a Plone project for the add-on to work.

## 📁 Repository layout

```text
sc-videos/
├── backend/                 # Python / Plone backend
│   ├── src/sc/videos/       # Package source
│   ├── tests/               # pytest test suite
│   └── pyproject.toml       # Python project metadata
├── frontend/                # Volto / React frontend
│   ├── packages/
│   │   └── volto-videos/    # Volto add-on source
│   ├── .storybook/          # Storybook configuration
│   └── package.json         # Workspace root
├── devops/                  # Docker Compose, Traefik
├── docs/                    # Sphinx documentation (this site)
└── Makefile                 # Top-level commands
```

## 🔄 Data flow

The following diagram shows how data flows through the system when an editor creates a Video content item:

```{mermaid}
sequenceDiagram
    participant Editor
    participant Volto as Volto (Frontend)
    participant API as plone.restapi
    participant Service as @video-metadata
    participant Provider as IVideoMetadataProvider

    Editor->>Volto: Paste video URL
    Volto->>Service: POST /@video-metadata {videoUrl}
    Service->>Service: resolve_url() → match provider
    Service->>Provider: fetch_metadata(video_id)
    Provider->>Provider: Call external API (YouTube/Vimeo)
    Provider-->>Service: VideoMetadata
    Service-->>Volto: JSON response
    Volto->>Volto: applyVideoMetadataToForm()
    Volto->>API: PATCH content fields
    API->>API: Event subscribers populate fields
    API-->>Volto: Updated content
```

## 🧩 Backend components

The backend is a standard Plone add-on built with Dexterity and `plone.restapi`:

- **Content type** (`Video`): a Dexterity container with the `IRemoteVideo` behavior.
- **Behavior** (`IRemoteVideo`): provides `videoUrl`, `duration`, `service`, `channel`, `video_id`, and `_metadata` fields.
- **Custom field** (`VideoURL`): a URI field that validates against registered providers.
- **REST service** (`@video-metadata`): accepts a URL, resolves the provider, fetches metadata, and returns JSON.
- **Integration layer**: extensible provider system with YouTube and Vimeo implementations.
- **Event subscribers**: autopopulate content fields from `_metadata` on create/modify.
- **Control panel**: settings for the YouTube Data API key.
- **Indexer**: exposes `videoUrl` as a catalog metadata column for search results.

See the {doc}`/reference/index` section for detailed specifications.

## 🎨 Frontend components

The frontend is a Volto add-on that registers content type configuration, blocks, and widgets:

- **Two blocks**:
  - **Video Player block**: restricted to Video content; reads `videoUrl` from the parent content and renders an embedded player.
  - **Video block**: available on any content type; lets the editor pick an existing Video via the object browser.
- **Widgets**:
  - **VideoURLWidget**: URL input with a "fetch metadata" button and inline preview.
  - **VideoMetadataWidget**: hidden widget that stores the raw metadata JSON.
  - **VideoInput**: in-block placeholder that opens the object browser filtered to Video content.
- **VideoPlayer component**: click-to-play player with preview image, YouTube and Vimeo embed support.
- **EditForm**: in-block edit placeholder that embeds `VideoURLWidget` directly in the block area.

## 🔗 How backend and frontend connect

The two packages communicate through Plone's standard REST API:

1. **Content CRUD**: Volto reads and writes Video content via `plone.restapi`'s standard endpoints. The `VideoURL` field's JSON schema provider tells Volto to render the `VideoURLWidget`.
2. **Metadata fetching**: the `@video-metadata` service is a custom REST endpoint the frontend calls when an editor clicks the "fetch" button in the `VideoURLWidget`.
3. **Catalog metadata**: the `videoUrl` catalog column is included in search results, allowing the Video block to display the URL without fetching the full content object.

:::{seealso}
- {doc}`video-metadata-pipeline`. Detailed walk-through of the metadata flow.
- {doc}`provider-system`. How video providers are registered and resolved.
- {doc}`blocks-and-widgets`. When to use each block and widget.
:::
