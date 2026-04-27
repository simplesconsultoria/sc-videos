# Changelog

<!--
   You should *NOT* be adding new change log entries to this file.
   You should create a file in the news directory instead.
   For helpful instructions, please see:
   https://github.com/plone/plone.releaser/blob/master/ADD-A-NEWS-ITEM.rst
-->

<!-- towncrier release notes start -->

## 1.0.0a2 (2026-04-27)


### New features:

- Added German (`de`) translations for the `sc.videos` message catalog. @ericof [#14](https://github.com/simplesconsultoria/sc-videos/issues/14)
- Added Italian (`it`) translations for the `sc.videos` message catalog. @ericof [#14](https://github.com/simplesconsultoria/sc-videos/issues/14)
- Added Spanish (`es`) translations for the `sc.videos` message catalog. @ericof [#14](https://github.com/simplesconsultoria/sc-videos/issues/14)
- Added Brazilian Portuguese (`pt_BR`) translations for the `sc.videos` message catalog. @ericof [#14](https://github.com/simplesconsultoria/sc-videos/issues/14)


### Bug fixes:

- Fixed dependency resolution failure on Python 3.12+ by installing `plone-stubs` from git in `requirements-mxdev.txt`. The marker (`python_version >= '3.12'`) lives in the requirements file, since `[tool.uv.sources]` is not honored when `[tool.uv] managed = false` and mxdev sections do not support PEP 508 markers per section. @ericof 

## 1.0.0a1 (2026-04-17)


### Breaking changes:

- Rename catalog metadata column and indexer from ``getRemoteUrl`` to ``videoUrl`` to disambiguate from Plone's standard ``getRemoteUrl`` index used by Link content type. 


### New features:

- Added `duration`, `duration_range`, and `has_video` catalog indexes with querystring support and duration ranges vocabulary. @ericof [#6](https://github.com/simplesconsultoria/sc-videos/issues/6)
- Added Series and Episode content types with `enable_series` registry setting, `series` catalog index, and querystring support. @ericof [#8](https://github.com/simplesconsultoria/sc-videos/issues/8)
- Renamed Series type to VideoSeries, permission to sc.videos.videoseries.add, and series catalog index to videoseries. @ericof [#10](https://github.com/simplesconsultoria/sc-videos/issues/10)
- Added playlist scraping script, Episode start field, metadata_for_content utility, and refactored utils into a package. @ericof [#11](https://github.com/simplesconsultoria/sc-videos/issues/11)
- Add @video-metadata REST API service for fetching external video metadata. 
- Add IVideoMetadataProvider named utility interface for pluggable video provider support. 
- Add Vimeo metadata provider using the public oEmbed endpoint. 
- Add YouTube API key and enable/disable toggle to the Video Settings control panel. 
- Add video integration layer with URL resolution, metadata fetching, and YouTube provider support (API and public oEmbed). 
- Move URL patterns from a hardcoded list into each ``IVideoMetadataProvider`` utility via a ``url_pattern`` attribute, making ``resolve_url`` extensible by third-party packages. 


### Bug fixes:

- Support YouTube live stream URLs (`youtube.com/live/<id>`) in `resolve_url`. 


### Internal:

- Add httpx as a backend dependency for external API calls. 
- Add typing annotations, rST docstrings with ``:param:`` / ``:returns:`` / ``:raises:`` to all modules under ``sc.videos``. 
- Move ``get_video_services`` to ``sc.videos.utils`` and reuse it in both the vocabulary and ``resolve_url``. 
- Rename IRemoteVideo.length to IRemoteVideo.duration (Int, seconds). 


### Documentation:

- Add YouTube Data API v3 setup guide to README. 
- Add comprehensive documentation for the backend: IRemoteVideo behavior reference, Video content type, @video-metadata REST API, control panel, configuration, and provider system. 


### Tests

- Add tests for ``get_video_services`` and ``image_from_url`` in ``sc.videos.utils``.
