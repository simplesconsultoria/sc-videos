---
myst:
  html_meta:
    "description": "Reference for CSS custom properties used by the video player"
    "property=og:description": "Reference for CSS custom properties used by the video player"
    "property=og:title": "🎨 CSS custom properties"
    "keywords": "Plone, Volto, CSS, custom properties, theming, sc-videos"
---

# 🎨 CSS custom properties

sc-videos defines CSS custom properties (variables) on `:root` that you can override in your project's theme to restyle the video player and widgets without modifying the add-on source.

## 🎬 Video player

| Variable | Default | Description |
|---|---|---|
| `--video-player-fallback-bg` | `#1a1a1a` | Background color shown when no preview image is available. |
| `--video-player-icon-size` | `68px` | Size of the play button icon overlay. |
| `--video-player-play-bg` | `rgba(0, 0, 0, 0.45)` | Background of the circular play button. |
| `--video-player-play-bg-hover` | `rgba(0, 0, 0, 0.65)` | Play button background on hover and focus. |

## 🔧 Widgets

| Variable | Default | Description |
|---|---|---|
| `--video-url-widget-cancel` | `#ff0010` | Fill color of the clear (✕) button SVG icon in the `VideoURLWidget`. |

## 📝 Usage

Override these in your project's SCSS or CSS:

```scss
:root {
  --video-player-fallback-bg: #000;
  --video-player-play-bg: rgba(255, 255, 255, 0.3);
  --video-player-play-bg-hover: rgba(255, 255, 255, 0.5);
  --video-url-widget-cancel: #e40166;
}
```

Variables are defined in `frontend/packages/volto-videos/src/theme/_root.scss`.

:::{seealso}
- {doc}`/how-to-guides/customize-player-theme` — Step-by-step theming guide.
- {doc}`blocks` — Block sizing and alignment options.
:::
