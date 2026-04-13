"""Extract YouTube video metadata without API authentication.

Uses the oEmbed endpoint, which is public and requires no API key.
Returns less data than the full API (no tags, no full description),
but is useful as a fallback or when no API key is configured.
"""

from sc.videos.integration.base import BaseClient
from sc.videos.integration.base import VideoMetadata


OEMBED_BASE = "https://www.youtube.com"


class YouTubePublicClient(BaseClient):
    """Fetch video metadata via YouTube's public oEmbed endpoint."""

    base_url = OEMBED_BASE

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        """Fetch metadata for a YouTube video using oEmbed.

        Note: oEmbed does not provide duration, description, or tags.
        Those fields will be empty in the returned metadata.
        """
        url = f"https://www.youtube.com/watch?v={video_id}"
        data = self.get(
            "/oembed",
            params={"url": url, "format": "json"},
        )
        return VideoMetadata(
            video_id=video_id,
            title=data.get("title", ""),
            description="",
            duration=0,
            thumbnail_url=_build_hq_thumbnail(video_id, data),
            channel=data.get("author_name", ""),
        )


def _build_hq_thumbnail(video_id: str, data: dict) -> str:
    """Return a high-quality thumbnail URL.

    oEmbed returns a thumbnail, but it is typically 480x360.
    We construct the maxresdefault URL and fall back to the oEmbed one.
    """
    oembed_thumb = data.get("thumbnail_url", "")
    # The maxresdefault image may not exist for every video,
    # but it is the best we can offer without an extra request.
    hq_url = f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg"
    return hq_url if video_id else oembed_thumb
