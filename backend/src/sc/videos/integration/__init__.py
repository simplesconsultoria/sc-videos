"""Video integration: URL resolution and metadata fetching."""

from dataclasses import dataclass
from sc.videos.integration.base import VideoMetadata
from sc.videos.interfaces import IVideoMetadataProvider
from sc.videos.utils import get_video_services
from zope.component import queryUtility


@dataclass(frozen=True)
class VideoReference:
    """A resolved video: which service hosts it and its ID on that service."""

    service: str
    video_id: str


def resolve_url(url: str) -> VideoReference | None:
    """Identify the hosting service and extract the video ID from a URL.

    Iterates over all registered :class:`IVideoMetadataProvider` utilities
    and tests each provider's :attr:`url_pattern` against *url*.

    :param url: Absolute video URL to resolve.
    :returns: A :class:`VideoReference` if *url* matches a known provider,
        or ``None``.
    """
    for provider in get_video_services():
        match = provider.url_pattern.search(url)
        if match:
            return VideoReference(service=provider.id, video_id=match.group(1))
    return None


def fetch_metadata(ref: VideoReference) -> VideoMetadata:
    """Fetch video metadata using the registered provider for *ref.service*.

    :param ref: Resolved video reference.
    :returns: Metadata retrieved from the provider.
    :raises LookupError: If no provider is registered for the service.
    """
    provider = queryUtility(IVideoMetadataProvider, name=ref.service)
    if provider is None:
        msg = f"No metadata provider registered for service: {ref.service}"
        raise LookupError(msg)
    return provider.fetch_metadata(ref.video_id)
