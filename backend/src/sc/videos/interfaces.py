"""Module where all interfaces, events and exceptions live."""

from zope.interface import Attribute
from zope.interface import Interface
from zope.publisher.interfaces.browser import IDefaultBrowserLayer


class IBrowserLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class IVideoMetadataProvider(Interface):
    """A named utility that fetches video metadata for a specific service.

    Each provider is registered as a named utility whose name matches the
    service identifier (e.g. ``"youtube"``, ``"vimeo"``).
    """

    id = Attribute("Short machine-readable identifier of the service.")
    name = Attribute("Human-readable display name of the service.")
    url_pattern = Attribute(
        "Compiled ``re.Pattern[str]`` with one capture group for the video ID."
    )

    def fetch_metadata(video_id: str):
        """Fetch metadata for a video hosted on this service.

        :param video_id: Provider-specific video identifier.
        :returns: Populated metadata for the video.
        """
