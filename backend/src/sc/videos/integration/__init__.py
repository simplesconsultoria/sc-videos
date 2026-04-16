"""Video integration: URL resolution and metadata fetching."""

from dataclasses import dataclass
from sc.videos.integration.base import VideoMetadata
from sc.videos.interfaces import IVideoMetadataProvider
from zope.component import queryUtility

import re


# Registry of supported services and their URL patterns.
# Each pattern must have a single capturing group for the video ID.
_SERVICE_PATTERNS: list[tuple[str, re.Pattern]] = [
    (
        "youtube",
        re.compile(
            r"(?:youtu\.be/|youtube\.com/(?:watch\?.*v=|embed/|v/|shorts/|live/))"
            r"([A-Za-z0-9_-]{11})"
        ),
    ),
    (
        "vimeo",
        re.compile(r"(?:vimeo\.com|player\.vimeo\.com/video)/(\d+)"),
    ),
]


@dataclass(frozen=True)
class VideoReference:
    """A resolved video: which service hosts it and its ID on that service."""

    service: str
    video_id: str


def resolve_url(url: str) -> VideoReference | None:
    """Given a video URL, identify the hosting service and extract the video ID.

    Returns a VideoReference if the URL matches a known service, or None.
    """
    for service, pattern in _SERVICE_PATTERNS:
        match = pattern.search(url)
        if match:
            return VideoReference(service=service, video_id=match.group(1))
    return None


def fetch_metadata(ref: VideoReference) -> VideoMetadata:
    """Fetch video metadata using the registered provider for the service.

    Looks up a named IVideoMetadataProvider utility matching ref.service.
    Raises LookupError if no provider is registered for the service.
    """
    provider = queryUtility(IVideoMetadataProvider, name=ref.service)
    if provider is None:
        msg = f"No metadata provider registered for service: {ref.service}"
        raise LookupError(msg)
    return provider.fetch_metadata(ref.video_id)
