---
myst:
  html_meta:
    "description": "Reference for the IRemoteVideo behavior. fields, schema, and usage"
    "property=og:description": "Reference for the IRemoteVideo behavior. fields, schema, and usage"
    "property=og:title": "📋 IRemoteVideo behavior"
    "keywords": "Plone, behavior, IRemoteVideo, schema, fields, sc-videos"
---

# 📋 IRemoteVideo behavior

The `IRemoteVideo` behavior provides fields for storing external video information on any Dexterity content type.
It is registered as `sc.videos.remotevideo` and applied by default to the {doc}`content-type`.

**Module:** `sc.videos.behaviors.video`
**Interface:** `sc.videos.behaviors.video.IRemoteVideo`

## 🏷️ Fields

| Field | Type | Required | Default | Widget | Description |
|---|---|---|---|---|---|
| `videoUrl` | `VideoURL` | Yes |. | `VideoURL` | External video URL (YouTube, Vimeo). Validated against registered providers. |
| `duration` | `Int` | No |. |. | Video duration in seconds. Populated automatically from metadata. |
| `service` | `Choice` | No |. |. | Video hosting service. Values from the `sc.videos.vocabulary.video_services` vocabulary. |
| `channel` | `TextLine` | No | `""` |. | Channel or author name of the video. |
| `video_id` | `ASCIILine` | No | `""` |. | Provider-specific video identifier (for example, YouTube's 11-character ID). |
| `_metadata` | `JSONField` | No | `{}` | `VideoMetadata` | Raw metadata JSON returned by the provider. Used internally to populate other fields. |

## 📂 Field organization

The behavior organizes its fields into two fieldsets:

1. **Default**: contains `videoUrl` (ordered before all other fields via `directives.order_before`).
2. **Video Metadata**: contains `duration`, `service`, `channel`, `video_id`, and `_metadata`. These fields are populated automatically by the metadata fetching pipeline and are typically not edited by hand.

## 🔗 The `VideoURL` field

`VideoURL` is a custom field type (`sc.videos.fields.url.VideoURL`) that extends `zope.schema.URI` with provider validation:

- Validates that the value is a well-formed URI.
- Calls `resolve_url()` to check the URL against all registered {doc}`/concepts/provider-system` patterns.
- Raises `InvalidVideoURL` if the URL doesn't match any known provider.

On the frontend, it renders as the `VideoURLWidget`. see {doc}`widgets`.

## ⚡ Event-driven metadata population

When a Video content item is created or modified, event subscribers automatically populate the behavior fields from the `_metadata` JSON:

- `sc.videos.subscribers.video.added`. fires on `IObjectAddedEvent`.
- `sc.videos.subscribers.video.modified`. fires on `IObjectModifiedEvent`.

Both call `_update_video_metadata()`, which:

1. Reads `_metadata` from the content object.
2. Copies `duration`, `channel`, `video_id`, and `service` into their respective fields (only if changed).
3. Downloads the thumbnail from `thumbnail_url` and sets it as `preview_image` (only if the content doesn't already have one).

## 🧩 Using the behavior on other content types

The behavior can be applied to any Dexterity content type.
Add it via GenericSetup XML or in your type's Python schema:

```xml
<!-- types/MyVideo.xml -->
<property name="behaviors" purge="false">
  <element value="sc.videos.remotevideo" />
</property>
```

The behavior provides the video fields, but you will also need the frontend
add-on installed for the `VideoURLWidget` and metadata fetching to work in the
Volto editor.

:::{seealso}
- {doc}`content-type`. The default Video content type that uses this behavior.
- {doc}`/concepts/video-metadata-pipeline`. How metadata flows from URL to content fields.
- {doc}`rest-api`. The `@video-metadata` endpoint that powers the metadata fetching.
:::
