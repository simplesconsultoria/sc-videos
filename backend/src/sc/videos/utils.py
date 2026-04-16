from collections.abc import Sequence
from plone.namedfile import NamedBlobImage
from sc.videos.integration.base import MetadataProvider
from sc.videos.interfaces import IVideoMetadataProvider
from zope.component import getAllUtilitiesRegisteredFor

import httpx


def get_video_services() -> Sequence[MetadataProvider]:
    """Return all registered :class:`IVideoMetadataProvider` utilities.

    :returns: Sequence of provider instances.
    """
    return getAllUtilitiesRegisteredFor(IVideoMetadataProvider)


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
