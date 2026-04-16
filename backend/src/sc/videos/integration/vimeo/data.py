"""Vimeo metadata provider utility."""

from sc.videos.integration.base import MetadataProvider
from sc.videos.integration.base import VideoMetadata
from sc.videos.integration.vimeo.public import VimeoPublicClient
from sc.videos.interfaces import IVideoMetadataProvider
from zope.interface import implementer


@implementer(IVideoMetadataProvider)
class VimeoMetadataProvider(MetadataProvider):
    """Named utility that fetches Vimeo video metadata via oEmbed."""

    id: str = "vimeo"
    name: str = "Vimeo"

    def _get_client(self) -> VimeoPublicClient:
        return VimeoPublicClient()

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        """Fetch metadata for a Vimeo video by its ID."""
        client = self._get_client()
        return client.fetch_metadata(video_id)
