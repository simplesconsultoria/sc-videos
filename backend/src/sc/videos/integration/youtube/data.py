"""YouTube metadata provider utility."""

from plone import api
from sc.videos.integration.base import MetadataProvider
from sc.videos.integration.base import VideoMetadata
from sc.videos.integration.youtube.api import YouTubeAPIClient
from sc.videos.integration.youtube.public import YouTubePublicClient
from sc.videos.interfaces import IVideoMetadataProvider
from zope.interface import implementer


@implementer(IVideoMetadataProvider)
class YouTubeMetadataProvider(MetadataProvider):
    """Named utility that fetches YouTube video metadata.

    Uses the authenticated API client when an API key is configured
    and enabled, otherwise falls back to the public oEmbed endpoint.
    """

    id: str = "youtube"
    name: str = "YouTube"

    def _get_client(self) -> YouTubeAPIClient | YouTubePublicClient:
        api_enabled: bool = api.portal.get_registry_record(
            "sc.videos.youtube_api_enabled"
        )
        api_key: str = api.portal.get_registry_record("sc.videos.youtube_api_key")
        if api_enabled and api_key:
            return YouTubeAPIClient(api_key=api_key)
        return YouTubePublicClient()

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        """Fetch metadata for a YouTube video by its ID."""
        client = self._get_client()
        return client.fetch_metadata(video_id)
