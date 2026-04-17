---
myst:
  html_meta:
    "description": "Glossary of terms used in the sc-videos documentation"
    "property=og:description": "Glossary of terms used in the sc-videos documentation"
    "property=og:title": "📖 Glossary"
    "keywords": "Plone, glossary, terms, sc-videos"
---

(glossary-label)=

# 📖 Glossary

```{glossary}
:sorted: true

add-on
    An add-on extends Plone's functionality.
    sc-videos is a monorepo add-on that ships both a Python backend package and a JavaScript frontend package.

    -   [Plone core add-ons](https://github.com/collective/awesome-plone#readme)
    -   [Volto add-ons](https://github.com/collective/awesome-volto#readme)

behavior
    A Plone Dexterity behavior is a reusable set of fields and functionality that can be applied to content types.
    sc-videos provides the `IRemoteVideo` behavior for external video support.

block
    A Volto block is a content unit that can be placed on any page.
    sc-videos provides the Video Player block and the Video block.

catalog metadata
    A column in Plone's portal catalog that stores a value alongside search results.
    sc-videos adds a `videoUrl` metadata column so the Video block can display the URL without fetching the full content object.

content type
    A Plone content type defines a kind of content that can be created, edited, and managed.
    sc-videos provides the Video content type for external videos.

data adapter
    A function registered on a Volto block configuration that transforms raw data (for example, from the object browser) into the block's data shape.
    The Video block uses a data adapter to map catalog items to `VideoHref`.

Dexterity
    The content type framework used by Plone 6+.
    Video is a Dexterity container type.

GenericSetup
    A Plone framework for importing and exporting configuration (content types, permissions, registry settings).
    sc-videos uses GenericSetup profiles to register its components.

IRemoteVideo
    The Plone behavior interface provided by sc-videos.
    It adds video URL, metadata, and provider fields to any Dexterity content type.

IVideoMetadataProvider
    The Zope interface for video provider utilities.
    Each provider (YouTube, Vimeo) implements this interface and registers as a named utility.

metadata provider
    A component that can resolve a video URL and fetch structured metadata from an external service.
    See {term}`IVideoMetadataProvider`.

monorepo
    A repository that contains multiple packages developed and released together.
    sc-videos is a monorepo with a backend (PyPI) and a frontend (npm) package.

Markedly Structured Text
MyST
    [Markedly Structured Text (MyST)](https://myst-parser.readthedocs.io/en/latest/) is a rich and extensible flavor of Markdown used to author this documentation.

oEmbed
    An open standard for fetching metadata and embed codes from content providers via a simple HTTP API.
    sc-videos uses oEmbed endpoints for YouTube (fallback) and Vimeo.

Plone
    [Plone](https://plone.org/) is an open-source content management system trusted by governments, universities, and businesses worldwide.

Plone Sphinx Theme
plone-sphinx-theme
    [Plone Sphinx Theme](https://plone-sphinx-theme.readthedocs.io/) is the Sphinx theme used by this documentation.

Sphinx
    [Sphinx](https://www.sphinx-doc.org/en/master/) is the documentation generator used to build this site from MyST Markdown sources.

Video block
    A Volto block for embedding an existing Video content item on any page.
    Uses the object browser to pick a Video.

Video Player block
    A Volto block restricted to Video content pages.
    Reads the video URL from the parent content and renders an embedded player.

VideoURLWidget
    A Volto edit widget for entering video URLs.
    Includes a fetch button that calls the `@video-metadata` REST API and autopopulates content fields.

Volto
    [Volto](https://github.com/plone/volto) is the React-based frontend for Plone 6.
    sc-videos' frontend package is a Volto add-on.
```
