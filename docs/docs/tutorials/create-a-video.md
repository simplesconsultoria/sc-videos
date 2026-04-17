---
myst:
  html_meta:
    "description": "Create your first Video content in Plone with sc-videos"
    "property=og:description": "Create your first Video content in Plone with sc-videos"
    "property=og:title": "🎬 Create your first Video"
    "keywords": "Plone, Video, create, tutorial, sc-videos, YouTube, Vimeo"
---

# 🎬 Create your first Video

In this tutorial you will create a Video content item, paste a YouTube or Vimeo URL, and see the add-on automatically fetch the video's title, description, thumbnail, and duration.

## 🔧 Prerequisites

- sc-videos installed and activated (see {doc}`install`).
- A running Plone site with the Volto frontend.

## 1️⃣ Add a Video

1. Navigate to the folder where you want to add the video.
2. Click {guilabel}`Add new…` in the toolbar.
3. Select **Video** from the content type list.

You will see the Video edit form with a **Video Player** block in the main area.
The block shows an icon and an input field — this is the in-block edit form.

## 2️⃣ Paste a video URL

1. Click the input field in the Video Player block.
2. Paste a video URL, for example:
   - YouTube: `https://www.youtube.com/watch?v=x7QX9tQxEBc`
   - Vimeo: `https://vimeo.com/110591222`

:::{note}
The input accepts any URL supported by the registered providers.
Out of the box, YouTube and Vimeo URLs are recognized.
:::

## 3️⃣ Fetch metadata

After pasting the URL, click the **arrow button** (→) to the right of the input field.
The add-on will:

1. Send the URL to the `@video-metadata` REST API.
2. The backend resolves the URL to a provider (YouTube or Vimeo).
3. The provider fetches metadata from the external service.
4. The metadata is returned to the frontend.

Once the fetch succeeds, you will see:

- The **Video Player** block switches from the input form to the embedded player with a preview image.
- The content's **title** and **description** are auto-populated from the video metadata (if they were empty).
- A **metadata preview** appears in the sidebar showing the thumbnail, channel name, and duration.

## 4️⃣ Review and save

1. Check the title and description — edit them if you want to customize them.
2. Adjust the player settings in the sidebar:
   - **Auto Play** — start the video automatically when the page loads.
   - **Size** — small, medium, or large.
   - **Alignment** — left, right, center, wide, or full width.
3. Click {guilabel}`Save`.

## 5️⃣ View the result

After saving, the Video page shows the embedded player with a click-to-play preview image.
Clicking the play button loads the video from the external provider.

:::{tip}
The add-on downloads the video thumbnail and stores it as the content's `preview_image`.
This image is used as the player's poster frame and in listing views across the site.
:::

## ⏭️ Next steps

- {doc}`embed-video-in-page` — Embed an existing Video in any page using the Video block.
- {doc}`/how-to-guides/configure-youtube-api` — Get richer metadata (duration, description, tags) by setting up a YouTube API key.
