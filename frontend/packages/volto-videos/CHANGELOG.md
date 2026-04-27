# Changelog

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html#contributing-change-log-label
-->

<!-- towncrier release notes start -->

## 1.0.0-alpha.2 (2026-04-27)

### Feature

- Added German (`de`) translations for the `volto-videos` frontend catalog. @ericof [#14](https://github.com/simplesconsultoria/sc-videos/issue/14)
- Added Italian (`it`) translation catalog to `volto-videos`, including translations for the new caption-related strings. @ericof [#14](https://github.com/simplesconsultoria/sc-videos/issue/14)
- Added Spanish (`es`) translations for the `volto-videos` frontend catalog. @ericof [#14](https://github.com/simplesconsultoria/sc-videos/issue/14)
- Added Brazilian Portuguese (`pt_BR`) translations for the `volto-videos` frontend catalog. @ericof [#14](https://github.com/simplesconsultoria/sc-videos/issue/14)
- Added caption support to the Video block. New schema fields `showCaption` (boolean, default `true`), `title`, and `description` are rendered below the player using the `Caption` component from `@kitconcept/volto-light-theme`. Caption `title` and `description` are prepopulated from the selected Video content item's `Title` and `Description` (both via the in-block picker and the sidebar object browser) when the fields are empty. @ericof [#15](https://github.com/simplesconsultoria/sc-videos/issue/15)
- Exposed description truncation as configurable settings under `config.settings.voltoVideos.description` (`maxLength` default `150`, `ellipsis` default `"..."`). Integrators can now customize the truncation applied to descriptions auto-populated by `applyVideoMetadataToForm`. @ericof [#16](https://github.com/simplesconsultoria/sc-videos/issue/16)

### Internal

- Migrated Edit widget registration to `config.registerWidget`. View widgets still use direct `config.widgets.views.widget` assignment, since Volto does not yet support registering view widgets via the registry API. @ericof [#16](https://github.com/simplesconsultoria/sc-videos/issue/16)

## 1.0.0-alpha.1 (2026-04-17)

### Breaking

- Update VideoBlock to consume the renamed ``videoUrl`` catalog metadata field (previously ``getRemoteUrl``). 

### Feature

- Extensible frontend video provider registry via @plone/registry. @ericof [#4](https://github.com/simplesconsultoria/sc-videos/issue/4)
- Changed block restriction logic to use `has_video` catalog index instead of checking content type. Renamed `Video` interface to `IRemoteVideo`. @ericof [#6](https://github.com/simplesconsultoria/sc-videos/issue/6)
- Added default blocks layout for Series and Episode content types. @ericof [#8](https://github.com/simplesconsultoria/sc-videos/issue/8)
- Renamed initialBlocks.Series to initialBlocks.VideoSeries. @ericof [#10](https://github.com/simplesconsultoria/sc-videos/issue/10)
- Add Storybook stories for all widgets, blocks, MetadataPreview, and VideoPlayer components, with MSW mocking for the ``@video-metadata`` endpoint. 
- Add VideoMetadataWidget (hidden widget) for storing video metadata in form state. 
- Add VideoPlayer component with YouTube and Vimeo support, preview images, and click-to-play. 
- Add VideoURLWidget with metadata fetching from @@video-metadata service and sibling field population. 
- Add an in-block ``VideoInput`` placeholder for the Video block. When no video is selected the block now renders a "pick a video" affordance that opens the Volto object browser filtered to ``Video`` content (no external URLs); selection is committed via the block's new ``dataAdapter``. 
- Show the ``VideoURLWidget`` directly inside the VideoPlayer block when the parent Video has no URL yet, so editors can paste a URL and fetch metadata without opening the content sidebar. 

### Bugfix

- Drop the local ``catalog:`` block from ``pnpm-workspace.yaml`` so ``.pnpmfile.cjs`` can inject the full Volto catalog from ``core/catalog.json``. Fixes container image builds that were failing with ``Cannot find module '@simplesconsultoria/volto-videos'`` because an incomplete catalog broke workspace-link resolution for ``@plone/volto``. 
- Re-sync ``VideoURLWidget`` local state with ``props.value`` so a second instance of the widget (e.g. the content-type sidebar form) reflects URL changes made from the in-block EditForm. 
- Stop showing the clear/cancel button on freshly-created Videos. The backend defaults ``_metadata`` to an empty ``{}``, which the widget previously read as truthy and treated as populated metadata. 
- VideoURLWidget now collapses line breaks and extra whitespace when populating the description field from fetched metadata, and truncates long descriptions to 150 characters with an ellipsis. 

### Internal

- Add tests for `helpers/blocks`, `helpers/applyMetadata`, and the `MetadataPreview` sidebar component, and wire the `@simplesconsultoria/volto-videos` alias into the vitest config so component tests can resolve addon-relative imports. 
- Extract helpers (format, video, videoMetadata) with full test coverage. 
- Extract the sidebar metadata preview into a reusable `MetadataPreview` component and move the form-population logic out of `VideoURLWidget` into a tested `applyVideoMetadataToForm` helper. 
- Move inline JSX styles from `MetadataPreview` and `VideoURLWidget` to dedicated SCSS files under `theme/components/` and `theme/widgets/`. 
- Refactor ``applyVideoMetadataToForm`` to use a declarative field-mapping array instead of repeated ``if`` blocks. 
- Share canned video metadata (``YOUTUBE_METADATA`` / ``VIMEO_METADATA``) between Storybook MSW handlers and vitest unit tests via ``src/mocks/videoMetadata.ts``. 

### Documentation

- Add comprehensive documentation for the frontend: Volto blocks reference, widgets reference, CSS custom properties, Storybook branding, and updated README.
