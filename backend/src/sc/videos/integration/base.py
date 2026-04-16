"""Base HTTP client for external API integrations."""

from dataclasses import dataclass
from dataclasses import field

import httpx


DEFAULT_TIMEOUT = 10.0
DEFAULT_HEADERS = {
    "Accept": "application/json",
}


@dataclass
class VideoMetadata:
    """Metadata extracted from an external video source."""

    video_id: str
    title: str
    description: str
    duration: int
    thumbnail_url: str
    channel: str
    tags: list[str] = field(default_factory=list)


class BaseClient:
    """Base HTTP client wrapping httpx for external API calls."""

    base_url: str = ""

    def __init__(self, timeout: float = DEFAULT_TIMEOUT):
        self._timeout = timeout

    def _build_client(self) -> httpx.Client:
        return httpx.Client(
            base_url=self.base_url,
            timeout=self._timeout,
            headers=DEFAULT_HEADERS,
        )

    def get(self, path: str, params: dict | None = None) -> dict:
        """Perform a GET request and return the parsed JSON response."""
        with self._build_client() as client:
            response = client.get(path, params=params)
            response.raise_for_status()
            return response.json()

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        """Fetch metadata for a video.  Subclasses must implement this."""
        raise NotImplementedError


class MetadataProvider:
    """Base class for metadata providers."""

    id: str = ""
    name: str = ""

    def _get_client(self) -> BaseClient:
        raise NotImplementedError(
            "Subclasses must implement _get_client() to return a configured BaseClient instance."
        )

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        raise NotImplementedError(
            "Subclasses must implement fetch_metadata() to return a VideoMetadata instance."
        )
