---
myst:
  html_meta:
    "description": "Conceptual explanations of sc-videos architecture and design"
    "property=og:description": "Conceptual explanations of sc-videos architecture and design"
    "property=og:title": "💡 Concepts"
    "keywords": "Plone, concepts, architecture, sc-videos"
---

# 💡 Concepts

Concepts are **understanding-oriented** — they explain the background and context needed to work effectively with sc-videos.

> Explanation is discussion. It clarifies and illuminates a topic.
> — [Diátaxis](https://diataxis.fr/explanation/)

```{seealso}
Learn more about the [Diátaxis explanation](https://diataxis.fr/explanation/) documentation type.
```

## 📚 Topics

- {doc}`architecture` — Monorepo layout, backend/frontend data flow, and how the pieces fit together.
- {doc}`video-metadata-pipeline` — End-to-end flow from pasting a URL to populating content fields.
- {doc}`provider-system` — The extensible IVideoMetadataProvider architecture with URL pattern matching and client hierarchy.
- {doc}`blocks-and-widgets` — Video Player block vs Video block, widget roles, and when to use each.

```{toctree}
:hidden: true
:maxdepth: 1

architecture
video-metadata-pipeline
provider-system
blocks-and-widgets
```
