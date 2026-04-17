# 🎬 Video Support for Plone

[![Built with Cookieplone](https://img.shields.io/badge/built%20with-Cookieplone-0083be.svg?logo=cookiecutter)](https://github.com/plone/cookieplone-templates/)
[![CI](https://github.com/simplesconsultoria/sc-videos/actions/workflows/main.yml/badge.svg)](https://github.com/simplesconsultoria/sc-videos/actions/workflows/main.yml)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://simplesconsultoria.github.io/sc-videos/)
[![Storybook](https://img.shields.io/badge/-Storybook-ff4785?logo=Storybook&logoColor=white&style=flat-square)](https://simplesconsultoria.github.io/sc-videos/storybook/)

**sc-videos** is a monorepo Plone add-on that brings first-class video support to your Plone 6.1+ site.

It ships two packages that are always released and installed together:

| Package | Registry | Description |
|---|---|---|
| [`sc.videos`](./backend) | [PyPI](https://pypi.org/project/sc.videos/) | Backend: content type, behavior, REST API, provider integrations |
| [`@simplesconsultoria/volto-videos`](./frontend) | [npm](https://www.npmjs.com/package/@simplesconsultoria/volto-videos) | Frontend: Volto blocks, widgets, player component |

## ✨ Features

- 📄 **Video content type** — a Dexterity container for external videos with automatic metadata fetching, preview images, and categorization.
- 🔌 **Extensible provider system** — YouTube (API + public oEmbed) and Vimeo out of the box; add your own with a single named utility.
- 🌐 **`@video-metadata` REST API** — paste a URL, get structured metadata (title, description, duration, thumbnail, channel, tags).
- 🧱 **Two Volto blocks**:
  - **Video Player block** — for Video content pages; embeds the player with an in-block URL entry form.
  - **Video block** — for any page; pick an existing Video from the site via the object browser.
- 🎨 **Themeable player** — click-to-play with preview images, CSS custom properties for easy restyling.
- 📖 **Storybook** — interactive component demos for all widgets and blocks.

## 📚 Documentation

Full documentation is available at **[simplesconsultoria.github.io/sc-videos](https://simplesconsultoria.github.io/sc-videos/)**.

- [📦 Installation tutorial](https://simplesconsultoria.github.io/sc-videos/tutorials/install.html)
- [🎬 Create your first Video](https://simplesconsultoria.github.io/sc-videos/tutorials/create-a-video.html)
- [🔑 Configure YouTube API](https://simplesconsultoria.github.io/sc-videos/how-to-guides/configure-youtube-api.html)
- [🔌 Add a new video provider](https://simplesconsultoria.github.io/sc-videos/how-to-guides/add-a-video-provider.html)
- [📋 Full reference](https://simplesconsultoria.github.io/sc-videos/reference/)

## 🏁 Quick start (development)

### Prerequisites ✅

- [uv](https://6.docs.plone.org/install/create-project-cookieplone.html#uv)
- [Node.js 20+ and pnpm](https://6.docs.plone.org/install/create-project.html#node-js)
- [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
- [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
- [Docker](https://docs.docker.com/get-started/get-docker/) (optional)

### Installation 🔧

```shell
git clone git@github.com:simplesconsultoria/sc-videos.git
cd sc-videos
make install
```

### Fire up the servers 🔥

```shell
make backend-create-site
make backend-start
```

In a new terminal:

```shell
make frontend-start
```

Your Plone site is live at http://localhost:3000/ 🎉

## 🏗️ Project structure

```text
sc-videos/
├── backend/      # Python / Plone backend (sc.videos)
├── frontend/     # Volto / React frontend (@simplesconsultoria/volto-videos)
├── devops/       # Docker Compose, Traefik
└── docs/         # Sphinx documentation
```

## 🧐 Code quality

```shell
make format    # Auto-fix formatting (backend + frontend)
make lint      # Check code quality (backend + frontend)
make test      # Run all tests (backend + frontend)
make i18n      # Generate translation files
```

## 🙏 Credits

The development of this add-on was supported by:

- [Simples Consultoria](https://www.simplesconsultoria.com.br/)
- [IFPB — Instituto Federal da Paraíba](https://www.ifpb.edu.br/)
- [Openlegis](https://www.openlegis.com.br/)

Generated using [Cookieplone (2.0.0a1)](https://github.com/plone/cookieplone) and [cookieplone-templates (c0e9ef0)](https://github.com/plone/cookieplone-templates/commit/c0e9ef026f714e960832e00129c0ac2bcd0385f5) on 2026-04-10 16:04:11.973530. A special thanks to all contributors and supporters!
