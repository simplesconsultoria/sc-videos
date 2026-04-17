---
myst:
  html_meta:
    "description": "Embed an existing Video in any page using the Video block"
    "property=og:description": "Embed an existing Video in any page using the Video block"
    "property=og:title": "📺 Embed a Video in a page"
    "keywords": "Plone, Volto, Video block, embed, tutorial, sc-videos"
---

# 📺 Embed a Video in a page

The **Video block** lets you embed an existing Video content item in any page — a Document, a News Item, or any content type that supports Volto blocks.

This is different from the Video Player block (which is restricted to Video content pages).
The Video block references a Video via the object browser, so the same video can be embedded in multiple pages.

## 🔧 Prerequisites

- sc-videos installed and activated (see {doc}`install`).
- At least one Video content item already created (see {doc}`create-a-video`).

## 1️⃣ Add a Video block

1. Open any page in edit mode.
2. Click the {guilabel}`+` button to add a new block.
3. In the block chooser, look under the **Video** group and select **Video**.

You will see a placeholder with a camera icon and a {guilabel}`Browse` button.

## 2️⃣ Pick a Video

1. Click the browse button (folder icon) in the placeholder.
2. The **object browser** opens, filtered to show only Video content.
3. Navigate to or search for the Video you want to embed.
4. Click the Video to select it.

The block immediately switches to the player view, showing the video's preview image and title.

## 3️⃣ Configure the block

With the block selected, use the sidebar to adjust:

| Setting | Options | Description |
|---|---|---|
| **Link to** | Object browser | Change the selected Video. |
| **Auto Play** | On / Off | Start the video on page load. |
| **Size** | Small / Medium / Large | Controls the player width. |
| **Alignment** | Left / Right / Center / Wide / Full | Horizontal placement. |

## 4️⃣ Save and view

Click {guilabel}`Save`.
The page now shows the embedded video with a click-to-play preview image.
The player loads the video from the external provider (YouTube, Vimeo) when clicked.

:::{tip}
You can embed the same Video in multiple pages.
If the Video's metadata changes (e.g. title or thumbnail), all embedded instances reflect the update because they reference the same content object.
:::

## 🧩 Using in a Grid

The Video block is also available inside the **Grid block**, so you can place videos alongside other content in multi-column layouts.
See {doc}`/how-to-guides/use-video-block-in-grid` for examples.

## ⏭️ Next steps

- {doc}`/how-to-guides/customize-player-theme` — Customize the player's appearance with CSS custom properties.
- {doc}`/reference/blocks` — Full reference for both block types.
