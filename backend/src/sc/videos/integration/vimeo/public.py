"""Extract Vimeo video metadata without API authentication.

Uses the oEmbed endpoint, which is public and requires no API key.
"""

from sc.videos.integration.base import BaseClient
from sc.videos.integration.base import VideoMetadata


OEMBED_BASE = "https://vimeo.com"


class VimeoPublicClient(BaseClient):
    """Fetch video metadata via Vimeo's public oEmbed endpoint."""

    base_url = OEMBED_BASE

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        """Fetch metadata for a Vimeo video using oEmbed."""
        url = f"https://vimeo.com/{video_id}"
        data = self.get(
            "/api/oembed.json",
            params={"url": url},
        )
        return VideoMetadata(
            video_id=video_id,
            title=data.get("title", ""),
            description=data.get("description", "") or "",
            duration=int(data.get("duration", 0) or 0),
            thumbnail_url=data.get("thumbnail_url", ""),
            channel=data.get("author_name", ""),
        )
