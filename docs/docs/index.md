---
myst:
  html_meta:
    "description": "sc-videos: A Plone add-on providing a Video content type with YouTube and Vimeo support"
    "property=og:description": "sc-videos: A Plone add-on providing a Video content type with YouTube and Vimeo support"
    "property=og:title": "Video Support for Plone"
    "keywords": "Plone, Volto, video, YouTube, Vimeo, content type, add-on, sc-videos"
---

# 🎬 Video Support for Plone

**sc-videos** is a monorepo Plone add-on that brings first-class video support to your Plone 6.1+ site.
It ships two packages, a backend Python add-on (`sc.videos`) and a frontend Volto add-on (`@simplesconsultoria/volto-videos`), that are always released and installed together.

## ✨ Key features

- 📄 **Video content type**: a dedicated Dexterity container for external videos, with automatic metadata fetching, preview images, and categorization.
- 🔌 **Extensible provider system**: YouTube (API + public oEmbed) and Vimeo supported out of the box; add your own with a single named utility.
- 🌐 **`@video-metadata` REST API**: paste a URL, get structured metadata (title, description, duration, thumbnail, channel, tags).
- 🧱 **Two Volto blocks**:
  - **Video Player block**: for Video content pages; embeds the player with an in-block URL entry form.
  - **Video block**: for any page; pick an existing Video from the site via the object browser.
- 🎨 **Themeable player**: click-to-play with preview images, CSS custom properties for easy restyling.
- 📖 **Storybook coverage**: interactive component demos published alongside this documentation.

## 🚀 Quick start

Install both packages in your Plone project:

### Backend

Add `sc.videos` to your project's policy package's `project.toml` :

```toml
[project]
dependencies = [
    "Products.CMFPlone",
    "sc.videos",
```

To make this package available to a Plone installation, you need to load its ZCML configuration.

If your project has a Python package with custom code, add the following line to your package’s `dependencies.zcml` or `configure.zcml`:

```xml
   <include package="sc.videos" />
```

### Frontend

Add the Volto add-on to your policy package's `package.json`:

```json
{
  "dependencies": {
    "@simplesconsultoria/volto-videos": "workspace:*"
  },
  "addons": [
    "@simplesconsultoria/volto-videos"
  ]
}
```


### Installation

Run:

```console
make install
```

See {doc}`tutorials/install` for the full step-by-step guide.

## 📚 Where to start

:::::{grid} 2
:gutter: 3

::::{grid-item-card} 🎓 Tutorials
:link: tutorials/index
:link-type: doc

Step-by-step lessons to get you up and running: install the add-on, create your first Video, and embed it in a page.
::::

::::{grid-item-card} 📖 How-to guides
:link: how-to-guides/index
:link-type: doc

Goal-oriented recipes for common tasks: configure the YouTube API, add a new video provider, customize the player.
::::

::::{grid-item-card} 💡 Concepts
:link: concepts/index
:link-type: doc

Explanations of the architecture, the metadata pipeline, and how blocks and widgets fit together.
::::

::::{grid-item-card} 📋 Reference
:link: reference/index
:link-type: doc

Technical details: behavior fields, REST API, block schemas, widget props, CSS variables, and configuration.
::::

:::::

## 🔗 Links

- [GitHub repository](https://github.com/simplesconsultoria/sc-videos)
- <a href="https://simplesconsultoria.github.io/sc-videos/">Storybook (component demos)</a>
- [PyPI: sc.videos](https://pypi.org/project/sc.videos/)
- [npm: `@simplesconsultoria/volto-videos`](https://www.npmjs.com/package/@simplesconsultoria/volto-videos)


## 🙏 Credits

The development of this add-on was supported by the following entities:

- [Simples Consultoria](https://www.simplesconsultoria.com.br/)
- [IFPB - Instituto Federal da Paraíba](https://www.ifpb.edu.br/)
- [Openlegis](https://www.openlegis.com.br/)


```{toctree}
:caption: Tutorials
:maxdepth: 2
:hidden: true

tutorials/index
```

```{toctree}
:caption: How-to guides
:maxdepth: 2
:hidden: true

how-to-guides/index
```

```{toctree}
:caption: Concepts
:maxdepth: 2
:hidden: true

concepts/index
```

```{toctree}
:caption: Reference
:maxdepth: 2
:hidden: true

reference/index
```

```{toctree}
:caption: Appendices
:maxdepth: 2
:hidden: true

glossary
genindex
```
