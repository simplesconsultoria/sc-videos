"""Vimeo metadata provider utility."""

from sc.videos.integration.base import MetadataProvider
from sc.videos.integration.base import VideoMetadata
from sc.videos.integration.vimeo.public import VimeoPublicClient
from sc.videos.interfaces import IVideoMetadataProvider
from zope.interface import implementer

import re


@implementer(IVideoMetadataProvider)
class VimeoMetadataProvider(MetadataProvider):
    """Named utility that fetches Vimeo video metadata via oEmbed."""

    id: str = "vimeo"
    name: str = "Vimeo"
    url_pattern: re.Pattern[str] = re.compile(
        r"(?:vimeo\.com|player\.vimeo\.com/video)/(\d+)"
    )

    def _get_client(self) -> VimeoPublicClient:
        """Return the Vimeo public oEmbed client.

        :returns: Public client instance.
        """
        return VimeoPublicClient()

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        """Fetch metadata for a Vimeo video.

        :param video_id: Numeric Vimeo video identifier.
        :returns: Populated metadata.
        """
        client = self._get_client()
        return client.fetch_metadata(video_id)
