---
myst:
  html_meta:
    "description": "How to use the Video block inside a Grid for multi-column layouts"
    "property=og:description": "How to use the Video block inside a Grid for multi-column layouts"
    "property=og:title": "🧩 Use the Video block in a Grid"
    "keywords": "Plone, Volto, Grid, Video block, layout, sc-videos"
---

# 🧩 Use the Video block in a Grid

The **Video block** is registered as an allowed block inside Volto's Grid block, so you can place videos alongside other content in multi-column layouts.

## 1️⃣ Add a Grid block

1. Open any page in edit mode.
2. Add a new block and select **Grid**.
3. Choose the number of columns (for example, 2 or 3).

## 2️⃣ Add a Video block in a column

1. Click the {guilabel}`+` button inside one of the grid columns.
2. Select **Video** from the block chooser (under the Video group).
3. Use the browse button to pick an existing Video content item.

## 3️⃣ Combine with other content

Add text, images, or other blocks in the remaining columns.
For example:

| Column 1 | Column 2 |
|---|---|
| Video block (embedded player) | Slate block (description, links) |

## 💡 Tips

- The Video block inside a grid respects the column width. the `size` setting in the sidebar is relative to the column, not the full page.
- The `align` setting is typically not used inside grids since the grid controls horizontal placement.
- The Video Player block is **not** available in grids. it's restricted to Video content pages.

:::{note}
The Grid block registration is configured automatically when sc-videos is installed.
No extra configuration is needed.
:::

:::{seealso}
- {doc}`/tutorials/embed-video-in-page`. Tutorial for embedding videos outside of grids.
- {doc}`/reference/blocks`. Full block reference.
:::
