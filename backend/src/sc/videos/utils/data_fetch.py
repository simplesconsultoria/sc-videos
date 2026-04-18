from __future__ import annotations

from Acquisition import aq_inner
from dataclasses import asdict
from plone.namedfile import NamedBlobImage
from sc.videos import logger
from typing import TYPE_CHECKING

import httpx


if TYPE_CHECKING:
    from sc.videos.behaviors.video import IRemoteVideo


_DEFAULT_VALUE = object()

METADATA_ATTRS = ("duration", "service", "channel", "video_id", "subjects")


def metadata_for_content(content: IRemoteVideo) -> None:
    """Fetch metadata for content and update its fields.

    If ``_metadata`` is not set, resolves the video URL and fetches
    metadata from the provider. Then updates the content's metadata
    fields and preview image.

    :param content: Content object providing :class:`IRemoteVideo`.
    """
    metadata = content._metadata
    if not metadata:
        from sc.videos.integration import fetch_metadata
        from sc.videos.integration import resolve_url

        url = str(content.videoUrl) if content.videoUrl else ""
        if not url:
            return
        ref = resolve_url(url)
        if not ref:
            logger.warning("Could not resolve video URL: %s", url)
            return
        try:
            video_metadata = fetch_metadata(ref)
        except LookupError:
            logger.warning("No provider for service: %s", ref.service)
            return
        metadata = asdict(video_metadata)
        metadata["service"] = ref.service
        content._metadata = metadata

    # Update preview image
    thumbnail_url = metadata.get("thumbnail_url")
    if thumbnail_url and not content.preview_image:
        try:
            content.preview_image = image_from_url(thumbnail_url)
        except (httpx.HTTPError, ValueError):
            logger.warning("Could not fetch thumbnail: %s", thumbnail_url)

    # Update metadata attributes
    obj = aq_inner(content)
    for attr in METADATA_ATTRS:
        value = metadata.get(attr)
        current_value = getattr(obj, attr, _DEFAULT_VALUE)
        if value and current_value is not _DEFAULT_VALUE and value != current_value:
            setattr(obj, attr, value)


def image_from_url(url: str) -> NamedBlobImage:
    """Fetch image data from a URL and return it as a ``NamedBlobImage``.

    :param url: Absolute URL pointing to an image resource.
    :returns: Blob containing the downloaded image data.
    :raises ValueError: If the response ``Content-Type`` is not an image.
    """
    response = httpx.get(url, timeout=10.0)
    content_type = response.headers.get("Content-Type", "")
    if not content_type.startswith("image/"):
        raise ValueError(f"URL does not point to an image: {url}")

    filename = url.split("/")[-1]
    return NamedBlobImage(
        data=response.content, contentType=content_type, filename=filename
    )
