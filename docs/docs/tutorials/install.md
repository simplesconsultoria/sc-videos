---
myst:
  html_meta:
    "description": "Step-by-step guide to installing sc-videos in a Plone 6.1 project"
    "property=og:description": "Step-by-step guide to installing sc-videos in a Plone 6.1 project"
    "property=og:title": "📦 Install sc-videos"
    "keywords": "Plone, install, sc-videos, Volto, add-on, tutorial"
---

# 📦 Install sc-videos in a Plone project

This tutorial walks you through installing sc-videos in an existing Plone 6.1+ project that was generated with [Cookieplone](https://github.com/plone/cookieplone).

sc-videos is a **monorepo add-on**: it ships a backend Python package (`sc.videos`) and a frontend Volto package (`@simplesconsultoria/volto-videos`).
Both must be installed for the add-on to work.

## 🔧 Prerequisites

- A Plone 6.1+ project created with Cookieplone
- Python 3.12+
- Node.js 20+
- `make` available on your system

## 1️⃣ Install the backend

Add `sc.videos` to your project's backend policy package's `pyproject.toml`:

```toml
[project]
dependencies = [
    "Products.CMFPlone",
    "sc.videos",
```

Then load its ZCML configuration.
If your project has a Python package with custom code, add the following line to your package's `dependencies.zcml` or `configure.zcml`:

```xml
   <include package="sc.videos" />
```

## 2️⃣ Install the frontend

Add the Volto add-on to your project's **policy package** — the package under `frontend/packages/` that represents your site.

:::{note}
Always edit the policy package's `package.json`, not the top-level `frontend/package.json`.
:::

Open your policy package's `package.json` and add the dependency and register it in the `addons` array:

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

## 3️⃣ Install and start

From the project root, install all dependencies and start the servers:

```console
make install
make start
```

## 4️⃣ Activate the add-on

1. Open your Plone site in the browser (usually `http://localhost:3000`).
2. Navigate to {guilabel}`Site Setup` → {guilabel}`Add-ons`.
3. Find **Video Support for Plone** in the list and click {guilabel}`Install`.

## 5️⃣ Verify the installation

After activating the add-on:

1. Click {guilabel}`Add new…` in the toolbar.
2. You should see **Video** in the list of available content types.
3. The Video content type comes with a **Video Player** block pre-configured in its layout.

:::{tip}
If you don't see the Video content type, make sure both the backend and frontend packages are installed and the site has been restarted.
:::

## ⏭️ Next steps

- {doc}`create-a-video` — Create your first Video content and fetch metadata from YouTube or Vimeo.
- {doc}`/how-to-guides/configure-youtube-api` — Set up a YouTube API key for richer metadata.
