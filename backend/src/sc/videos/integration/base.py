"""Base HTTP client and data types for external API integrations."""

from dataclasses import dataclass
from dataclasses import field

import httpx
import re


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
    """Base HTTP client wrapping :mod:`httpx` for external API calls."""

    base_url: str = ""

    def __init__(self, timeout: float = DEFAULT_TIMEOUT) -> None:
        self._timeout = timeout

    def _build_client(self) -> httpx.Client:
        """Create a configured :class:`httpx.Client` instance.

        :returns: A new HTTP client bound to :attr:`base_url`.
        """
        return httpx.Client(
            base_url=self.base_url,
            timeout=self._timeout,
            headers=DEFAULT_HEADERS,
        )

    def get(self, path: str, params: dict | None = None) -> dict:
        """Perform a GET request and return the parsed JSON response.

        :param path: URL path relative to :attr:`base_url`.
        :param params: Optional query-string parameters.
        :returns: Decoded JSON body.
        :raises httpx.HTTPStatusError: On non-2xx responses.
        """
        with self._build_client() as client:
            response = client.get(path, params=params)
            response.raise_for_status()
            return response.json()

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        """Fetch metadata for a video.  Subclasses must override this.

        :param video_id: Provider-specific video identifier.
        :returns: Populated metadata.
        """
        raise NotImplementedError


class MetadataProvider:
    """Base class for metadata provider utilities.

    Subclasses must set :attr:`id` and :attr:`name`, and implement
    :meth:`_get_client` and :meth:`fetch_metadata`.
    """

    id: str = ""
    name: str = ""
    url_pattern: re.Pattern[str] = re.compile(r"(?!)")  # never matches

    def _get_client(self) -> BaseClient:
        """Return a configured client for this provider.

        :returns: Client instance.
        """
        raise NotImplementedError

    def fetch_metadata(self, video_id: str) -> VideoMetadata:
        """Fetch metadata for a video by its ID.

        :param video_id: Provider-specific video identifier.
        :returns: Populated metadata.
        """
        raise NotImplementedError
