# 🎬 sc.videos

[![PyPI](https://img.shields.io/pypi/v/sc.videos)](https://pypi.org/project/sc.videos/)
[![CI](https://github.com/simplesconsultoria/sc-videos/actions/workflows/main.yml/badge.svg)](https://github.com/simplesconsultoria/sc-videos/actions/workflows/main.yml)

**sc.videos** is the backend Python package for the [sc-videos](https://github.com/simplesconsultoria/sc-videos) Plone add-on.
It provides a Video content type with automatic metadata fetching from YouTube and Vimeo.

> **This package requires the frontend companion add-on [`@simplesconsultoria/volto-videos`](https://www.npmjs.com/package/@simplesconsultoria/volto-videos) to be installed in your Volto frontend.**
> Both packages are developed and released together from the [sc-videos monorepo](https://github.com/simplesconsultoria/sc-videos).

## ✨ Features

- 📄 **Video content type** — a Dexterity container with the `IRemoteVideo` behavior for external video URLs, automatic metadata population, and preview image downloads.
- 🔌 **Extensible provider system** — YouTube (Data API v3 + public oEmbed fallback) and Vimeo out of the box. Add new providers by registering a named `IVideoMetadataProvider` utility.
- 🌐 **`@video-metadata` REST API** — POST a video URL, receive structured metadata (title, description, duration, thumbnail, channel, tags).
- ⚙️ **Video Settings control panel** — configure the YouTube API key and toggle between API and oEmbed modes.
- 📇 **Catalog metadata** — `videoUrl` is exposed as a catalog column for efficient search result rendering.
- 🔐 **Custom field validation** — the `VideoURL` field validates URLs against registered providers at the schema level.

## 📦 Installation

Add `sc.videos` to your project's backend policy package's `pyproject.toml`:

```toml
[project]
dependencies = [
    "Products.CMFPlone",
    "sc.videos",
]
```

Load the ZCML configuration in your package's `dependencies.zcml` or `configure.zcml`:

```xml
<include package="sc.videos" />
```

Then install:

```shell
make install
```

After starting the site, activate **Video Support for Plone** in **Site Setup → Add-ons**.

## 📚 Documentation

Full documentation (tutorials, how-to guides, concepts, and reference) is available at:

**[simplesconsultoria.github.io/sc-videos](https://simplesconsultoria.github.io/sc-videos/)**

## 🤝 Contribute

For development setup and contribution guidelines, see the [monorepo README](https://github.com/simplesconsultoria/sc-videos) and the [contribution guide](https://simplesconsultoria.github.io/sc-videos/how-to-guides/contribute.html).

- [Issue tracker](https://github.com/simplesconsultoria/sc-videos/issues)
- [Source code](https://github.com/simplesconsultoria/sc-videos/)

## 📜 License

GPLv2

## 🙏 Credits

The development of this add-on was supported by:

- [Simples Consultoria](https://www.simplesconsultoria.com.br/)
- [IFPB — Instituto Federal da Paraíba](https://www.ifpb.edu.br/)
- [Openlegis](https://www.openlegis.com.br/)

Generated using [Cookieplone (2.0.0a1)](https://github.com/plone/cookieplone) and [cookieplone-templates (c0e9ef0)](https://github.com/plone/cookieplone-templates/commit/c0e9ef026f714e960832e00129c0ac2bcd0385f5) on 2026-04-10 16:04:11.973530. A special thanks to all contributors and supporters!
