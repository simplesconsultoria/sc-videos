# 🎬 @simplesconsultoria/volto-videos

[![npm](https://img.shields.io/npm/v/@simplesconsultoria/volto-videos)](https://www.npmjs.com/package/@simplesconsultoria/volto-videos)
[![Storybook](https://img.shields.io/badge/-Storybook-ff4785?logo=Storybook&logoColor=white&style=flat-square)](https://simplesconsultoria.github.io/sc-videos/storybook/)
[![CI](https://github.com/simplesconsultoria/sc-videos/actions/workflows/main.yml/badge.svg)](https://github.com/simplesconsultoria/sc-videos/actions/workflows/main.yml)

**@simplesconsultoria/volto-videos** is the frontend Volto add-on for the [sc-videos](https://github.com/simplesconsultoria/sc-videos) Plone project.
It provides video blocks, widgets, and a player component for Plone sites using the Volto frontend.

> **This package requires the backend companion add-on [`sc.videos`](https://pypi.org/project/sc.videos/) to be installed in your Plone backend.**
> Both packages are developed and released together from the [sc-videos monorepo](https://github.com/simplesconsultoria/sc-videos).

## ✨ Features

- 🧱 **Video Player block** — for Video content pages; shows an in-block URL entry form with metadata fetching, then switches to the embedded player.
- 📺 **Video block** — for any page; pick an existing Video from the site via the object browser. Also works inside Grid blocks.
- ✏️ **VideoURLWidget** — URL input with a "fetch metadata" button that auto-populates title, description, duration, and preview image from YouTube or Vimeo.
- 🎬 **VideoPlayer component** — click-to-play player with preview images, YouTube and Vimeo embed support.
- 🎨 **Themeable** — CSS custom properties for easy restyling without modifying the add-on source.
- 📖 **Storybook** — interactive demos for all components and widgets.

## 📦 Installation

Add this add-on to your project's **policy package** — the package under `frontend/packages/` that represents your site.

In your policy package's `package.json`, add the dependency and register it in the `addons` array:

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

Then install:

```shell
make install
```

## 📚 Documentation

Full documentation (tutorials, how-to guides, concepts, and reference) is available at:

**[simplesconsultoria.github.io/sc-videos](https://simplesconsultoria.github.io/sc-videos/)**

Interactive component demos are available in the **[Storybook](https://simplesconsultoria.github.io/sc-videos/storybook/)**.

## 🤝 Contribute

For development setup and contribution guidelines, see the [monorepo README](https://github.com/simplesconsultoria/sc-videos) and the [contribution guide](https://simplesconsultoria.github.io/sc-videos/how-to-guides/contribute.html).

### Development quick start

```shell
git clone git@github.com:simplesconsultoria/sc-videos.git
cd sc-videos/frontend
make install
make start           # Volto dev server on http://localhost:3000
make storybook-start # Storybook on http://localhost:6006
make test            # vitest
make lint            # eslint + prettier + stylelint
```

- [Issue tracker](https://github.com/simplesconsultoria/sc-videos/issues)
- [Source code](https://github.com/simplesconsultoria/sc-videos/)

## 📜 License

MIT

## 🙏 Credits

The development of this add-on was supported by:

- [Simples Consultoria](https://www.simplesconsultoria.com.br/)
- [IFPB — Instituto Federal da Paraíba](https://www.ifpb.edu.br/)
- [Openlegis](https://www.openlegis.com.br/)

Generated using [Cookieplone (2.0.0a1)](https://github.com/plone/cookieplone) and [cookieplone-templates (c0e9ef0)](https://github.com/plone/cookieplone-templates/commit/c0e9ef026f714e960832e00129c0ac2bcd0385f5) on 2026-04-10 16:04:11.973530. A special thanks to all contributors and supporters!
