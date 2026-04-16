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

        .. note::
           oEmbed does not provide duration, description, or tags.
           Those fields will be empty in the returned metadata.

        :param video_id: 11-character YouTube video identifier.
        :returns: Partially populated metadata (no duration/description/tags).
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
    """Return a high-quality thumbnail URL for a YouTube video.

    Constructs the ``maxresdefault`` URL when a *video_id* is available,
    otherwise falls back to the oEmbed-provided thumbnail.

    :param video_id: YouTube video identifier.
    :param data: Raw oEmbed response dict.
    :returns: Best-available thumbnail URL.
    """
    oembed_thumb = data.get("thumbnail_url", "")
    hq_url = f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg"
    return hq_url if video_id else oembed_thumb
