---
myst:
  html_meta:
    "description": "Technical reference for sc-videos. behaviors, API, blocks, widgets, configuration"
    "property=og:description": "Technical reference for sc-videos. behaviors, API, blocks, widgets, configuration"
    "property=og:title": "📋 Reference"
    "keywords": "Plone, reference, API, blocks, widgets, sc-videos"
---

# 📋 Reference

Reference material is **information-oriented**: it provides technical descriptions of the components that make up sc-videos.

> Reference guides are like a map. A map tells you what you need to know about the territory.
>. [Diátaxis](https://diataxis.fr/reference/)

## 🐍 Backend

- {doc}`behavior`. The `IRemoteVideo` behavior: fields, schema, and event-driven population.
- {doc}`content-type`. The Video content type: FTI, behaviors, permissions, and default layout.
- {doc}`rest-api`. The `@video-metadata` POST endpoint: request/response format and supported URLs.
- {doc}`control-panel`. Video Settings: YouTube API toggle and key.
- {doc}`configuration`. GenericSetup profiles, registry settings, catalog columns, permissions.

## ⚛️ Frontend

- {doc}`blocks`. Video Player block and Video block: schemas, data adapters, edit behavior.
- {doc}`widgets`. VideoURLWidget, VideoMetadataWidget, VideoInput: props and behavior.
- {doc}`css-variables`. CSS custom properties for theming the player and widgets.

```{toctree}
:hidden: true
:maxdepth: 1

behavior
content-type
rest-api
control-panel
configuration
blocks
widgets
css-variables
```
