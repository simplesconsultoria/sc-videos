"""YouTube Data API v3 client for fetching video metadata."""

from sc.videos.integration.base import BaseClient
from sc.videos.integration.base import VideoMetadata

import re


YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"


def _parse_iso8601_duration(raw: str) -> int:
    """Convert an ISO 8601 duration string (e.g. ``PT1H2M3S``) to seconds.

    :param raw: Duration string from the YouTube API.
    :returns: Total number of seconds, or ``0`` if *raw* cannot be parsed.
    """
    pattern = re.compile(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?")
    match = pattern.match(raw)
    if not match:
        return 0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


class YouTubeAPIClient(BaseClient):
    """Fetch video metadata using the YouTube Data API v3."""

    base_url = YOUTUBE_API_BASE

    def __init__(self, api_key: str, timeout: float = 10.0) -> None:
        super().__init__(timeout=timeout)
        self._api_key = api_key

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        """Fetch metadata for a single YouTube video.

        :param video_id: 11-character YouTube video identifier.
        :returns: Populated metadata.
        :raises ValueError: If the video is not found.
        """
        data = self.get(
            "/videos",
            params={
                "id": video_id,
                "key": self._api_key,
                "part": "snippet,contentDetails",
            },
        )
        items = data.get("items")
        if not items:
            msg = f"Video not found: {video_id}"
            raise ValueError(msg)
        item = items[0]
        snippet = item["snippet"]
        content_details = item["contentDetails"]
        return VideoMetadata(
            video_id=video_id,
            title=snippet.get("title", ""),
            description=snippet.get("description", ""),
            duration=_parse_iso8601_duration(content_details.get("duration", "")),
            thumbnail_url=_best_thumbnail(snippet.get("thumbnails", {})),
            channel=snippet.get("channelTitle", ""),
            tags=snippet.get("tags", []),
        )


def _best_thumbnail(thumbnails: dict) -> str:
    """Return the highest-resolution thumbnail URL from a thumbnails dict.

    :param thumbnails: Mapping of size keys to thumbnail objects.
    :returns: URL string, or ``""`` if *thumbnails* is empty.
    """
    for key in ("maxres", "standard", "high", "medium", "default"):
        if key in thumbnails:
            return thumbnails[key]["url"]
    return ""
