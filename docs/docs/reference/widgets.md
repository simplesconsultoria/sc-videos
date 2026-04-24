---
myst:
  html_meta:
    "description": "Reference for Volto widgets. VideoURLWidget, VideoMetadataWidget, VideoInput"
    "property=og:description": "Reference for Volto widgets. VideoURLWidget, VideoMetadataWidget, VideoInput"
    "property=og:title": "🔧 Volto widgets"
    "keywords": "Plone, Volto, widgets, VideoURLWidget, VideoInput, sc-videos"
---

# 🔧 Volto widgets

sc-videos registers several Volto widgets for editing and displaying video-related fields.

## ✏️ VideoURLWidget (edit)

The primary widget for entering video URLs and fetching metadata.
Used both in the content type's sidebar form and inside the Video Player block's in-block {doc}`/concepts/blocks-and-widgets`.

**Registration:** `config.widgets.widget.VideoURL`
**Module:** `components/Widgets/VideoURLWidget.tsx`
**Storybook:** `Widgets/VideoURL/Edit`

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Field name (for example, `videoUrl`). |
| `title` | `string` | Yes | Field label. |
| `description` | `string` | No | Help text shown below the field. |
| `value` | `string` | No | Current URL value. |
| `formData` | `Record<string, unknown>` | No | Parent form data. Used to read `_metadata` for the preview. |
| `onChange` | `(id: string, value: unknown) => void` | Yes | Called on every keystroke and by `applyVideoMetadataToForm`. |
| `onBlur` | `(id: string, value: string \| undefined) => void` | Yes | Called when the input loses focus. |
| `onClick` | `() => void` | Yes | Called when the input is clicked. |
| `placeholder` | `string` | No | Input placeholder text. |
| `isDisabled` | `boolean` | No | Disable the input. |
| `required` | `boolean` | No | Mark the field as required. |
| `error` | `string[]` | No | Validation error messages. |

### Behavior

1. **Typing**: updates the field value on every keystroke via `onChange`.
2. **Arrow button** (→). triggers `fetchVideoMetadata()`, which calls the {doc}`rest-api` and then runs `applyVideoMetadataToForm()` to populate sibling fields (title, description, duration, etc.).
3. **Clear button** (✕). resets the URL and clears `_metadata`.
4. **Metadata preview**: when `_metadata` is populated, shows a thumbnail, channel, and duration below the input.
5. **Multi-instance sync**: a `useEffect` re-syncs local state with `props.value` so multiple instances of the widget (for example, in-block EditForm + content sidebar) stay consistent.

### Metadata population

When the arrow button is clicked and metadata is fetched successfully, `applyVideoMetadataToForm()` writes to these sibling fields (only if currently empty):

| Form field | Metadata source | Transform |
|---|---|---|
| `title` | `metadata.title` |. |
| `description` | `metadata.text` | Truncated per `voltoVideos.description` settings (default: 150 chars with `...` ellipsis). See {doc}`configuration`. |
| `duration` | `metadata.duration` |. |
| `channel` | `metadata.channel` |. |
| `subjects` | `metadata.subjects` |. |
| `video_id` | `metadata.video_id` |. |
| `service` | `metadata.service` |. |
| `_metadata` | full metadata object | Always written |

## 👁️ VideoURLWidgetView (view)

Read-only display of a video URL as a clickable link.

**Registration:** `config.widgets.views.widget.VideoURL`
**Module:** `components/Widgets/VideoURLWidgetView.tsx`
**Storybook:** `Widgets/VideoURL/View`

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | No | The URL to display. |
| `children` | `ReactNode` | No | Custom render function. |
| `className` | `string` | No | CSS class name. |

## 🔒 VideoMetadataWidget (edit)

A hidden widget that stores the raw metadata JSON in form state.
Renders no visible UI. purely a data-storage mechanism.

**Registration:** `config.widgets.widget.VideoMetadata`
**Module:** `components/Widgets/VideoMetadataWidget.tsx`
**Storybook:** `Widgets/VideoMetadata/Edit`

## 👁️ VideoMetadataWidgetView (view)

View-mode counterpart of VideoMetadataWidget.
Also renders nothing. consumed programmatically.

**Registration:** `config.widgets.views.widget.VideoMetadata`

## 🔍 VideoInput

An in-block placeholder component for picking existing Video content.
Used by the Video block when no video is selected.

**Module:** `components/Widgets/VideoInput.tsx`
**Storybook:** `Widgets/VideoInput/Edit`

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | No | Block or field ID. |
| `block` | `string` | No | Block ID (used by `withObjectBrowser`). |
| `description` | `string` | No | Custom placeholder text. |
| `selected` | `boolean` | No | Whether the host block is currently selected. |
| `onFocus` | `() => void` | No | Called when the placeholder is clicked. |
| `onSelectItem` | `(url: string, item: Record<string, any>) => void` | Yes | Called when a Video is picked from the object browser. |

### Behavior

1. Renders a camera icon, descriptive text, and a browse button.
2. Clicking the browse button opens the Volto object browser with:
   - `mode: 'link'`
   - `searchableTypes: ['Video']`
   - `selectableTypes: ['Video']`
3. On selection, calls `onSelectItem` with the item's URL and full catalog metadata.
4. The hosting block's `dataAdapter` is responsible for committing the selection to block data.

Wrapped with the `withObjectBrowser` HOC so it manages its own object browser popup state.

:::{seealso}
- {doc}`blocks`. How these widgets are used within the blocks.
- {doc}`/concepts/blocks-and-widgets`. Architectural overview of the widget/block relationship.
:::
