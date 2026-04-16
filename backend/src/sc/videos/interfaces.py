"""Module where all interfaces, events and exceptions live."""

from zope.interface import Interface
from zope.publisher.interfaces.browser import IDefaultBrowserLayer


class IBrowserLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class IVideoMetadataProvider(Interface):
    """A named utility that fetches video metadata for a specific service."""

    name: str

    def fetch_metadata(video_id: str):
        """Return a VideoMetadata for the given video ID."""
