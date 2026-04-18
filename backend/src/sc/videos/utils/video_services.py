from collections.abc import Sequence
from sc.videos.integration.base import MetadataProvider
from sc.videos.interfaces import IVideoMetadataProvider
from zope.component import getAllUtilitiesRegisteredFor


def get_video_services() -> Sequence[MetadataProvider]:
    """Return all registered :class:`IVideoMetadataProvider` utilities.

    :returns: Sequence of provider instances.
    """
    return getAllUtilitiesRegisteredFor(IVideoMetadataProvider)
