---
myst:
  html_meta:
    "description": "How to customize the video player appearance with CSS custom properties"
    "property=og:description": "How to customize the video player appearance with CSS custom properties"
    "property=og:title": "🎨 Customize the video player"
    "keywords": "Plone, Volto, CSS, theming, video player, sc-videos"
---

# 🎨 Customize the video player

The video player uses CSS custom properties (variables) so you can restyle it from your project's theme without modifying the add-on's source code.

## 🎯 Override CSS variables

Add the following to your project's SCSS (for example, in your policy package's theme file):

```scss
:root {
  // Player background when no preview image is available
  --video-player-fallback-bg: #222;

  // Play button icon size
  --video-player-icon-size: 68px;

  // Play button background
  --video-player-play-bg: rgba(0, 0, 0, 0.45);
  --video-player-play-bg-hover: rgba(0, 0, 0, 0.65);

  // Cancel/clear button color in the VideoURLWidget
  --video-url-widget-cancel: #ff0010;
}
```

## 📐 Available variables

| Variable | Default | Description |
|---|---|---|
| `--video-player-fallback-bg` | `#1a1a1a` | Background color when there's no preview image. |
| `--video-player-icon-size` | `68px` | Size of the play button icon. |
| `--video-player-play-bg` | `rgba(0, 0, 0, 0.45)` | Play button circle background. |
| `--video-player-play-bg-hover` | `rgba(0, 0, 0, 0.65)` | Play button background on hover/focus. |
| `--video-url-widget-cancel` | `#ff0010` | Color of the clear (✕) button in the URL widget. |

## 🖼️ Aspect ratios

The player defaults to a 16:9 aspect ratio.
The aspect ratio is controlled via CSS classes on the `.video-player` container:

```scss
.video-player.aspect-16-9 { aspect-ratio: 16 / 9; }
.video-player.aspect-4-3  { aspect-ratio: 4 / 3; }
```

To add a custom aspect ratio, define a new class in your theme:

```scss
.video-player.aspect-21-9 { aspect-ratio: 21 / 9; }
```

## 📏 Block sizing

The Video block and Video Player block support three size options through the sidebar:

| Size | CSS class | Width |
|---|---|---|
| Large | `.large` | 100% |
| Medium | `.medium` | 50% |
| Small | `.small` | 25% |

Sizes respond to breakpoints. on mobile, all sizes render at 100%.

## 🎨 Theme variants

The Video Player block supports a `theme` property in its styling schema.
The theme is applied as a CSS class: `.player-theme-{name}`.

To style a custom theme, add rules in your SCSS:

```scss
.player-theme-dark {
  --video-player-fallback-bg: #000;
  --video-player-play-bg: rgba(255, 255, 255, 0.2);
}
```

:::{seealso}
- {doc}`/reference/css-variables`. Complete reference for all CSS custom properties.
- {doc}`/reference/blocks`. Block schema including size and alignment options.
:::
