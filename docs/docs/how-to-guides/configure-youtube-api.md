---
myst:
  html_meta:
    "description": "How to configure the YouTube Data API for richer video metadata"
    "property=og:description": "How to configure the YouTube Data API for richer video metadata"
    "property=og:title": "🔑 Configure the YouTube Data API"
    "keywords": "Plone, YouTube, API, configure, sc-videos"
---

# 🔑 Configure the YouTube Data API

By default, sc-videos uses YouTube's **public oEmbed endpoint** to fetch metadata — no API key required.
However, oEmbed returns limited data: only the title and thumbnail, but no description, duration, or tags.

To get the full metadata, you can enable the **YouTube Data API v3** and configure an API key.

## 1️⃣ Create a Google API key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to {guilabel}`APIs & Services` → {guilabel}`Library`.
4. Search for **YouTube Data API v3** and click {guilabel}`Enable`.
5. Go to {guilabel}`APIs & Services` → {guilabel}`Credentials`.
6. Click {guilabel}`Create Credentials` → {guilabel}`API key`.
7. Copy the generated key.

:::{tip}
For production use, restrict the API key:
- **Application restrictions**: HTTP referrers (your site's domain).
- **API restrictions**: YouTube Data API v3 only.
:::

## 2️⃣ Configure the control panel

1. In your Plone site, navigate to {guilabel}`Site Setup` → {guilabel}`Video Settings`.
2. Check the {guilabel}`Enable YouTube API` checkbox.
3. Paste your API key in the {guilabel}`YouTube API Key` field.
4. Click {guilabel}`Save`.

## 3️⃣ Verify

1. Create a new Video content item (or edit an existing one).
2. Paste a YouTube URL and click the fetch button (→).
3. The metadata preview should now show **duration**, **description**, and **tags** in addition to the title and thumbnail.

## 📊 Comparison

| Feature | Public oEmbed | YouTube Data API v3 |
|---|---|---|
| Title | ✅ | ✅ |
| Thumbnail | ✅ | ✅ (best available resolution) |
| Description | ❌ | ✅ |
| Duration | ❌ | ✅ |
| Tags / subjects | ❌ | ✅ |
| Channel name | ✅ (via author_name) | ✅ |
| API key required | No | Yes |
| Rate limits | Generous | 10,000 units/day (free tier) |

## ⚠️ Fallback behavior

If the YouTube API is enabled but the API key is invalid or the quota is exceeded, the service returns a `502 Bad Gateway` error.
It does **not** fall back to oEmbed automatically — this is by design, so administrators notice and fix the configuration rather than silently serving degraded metadata.

:::{seealso}
- {doc}`/reference/control-panel` — Video Settings control panel reference.
- {doc}`/concepts/provider-system` — How YouTube client selection works.
:::
