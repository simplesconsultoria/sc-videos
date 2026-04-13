"""Tests for sc.videos.integration.base."""

from sc.videos.integration.base import BaseClient
from sc.videos.integration.base import DEFAULT_HEADERS
from sc.videos.integration.base import DEFAULT_TIMEOUT
from sc.videos.integration.base import VideoMetadata
from unittest.mock import MagicMock
from unittest.mock import patch

import httpx
import pytest


class TestVideoMetadata:
    """Test the VideoMetadata dataclass."""

    def test_creation_with_all_fields(self):
        meta = VideoMetadata(
            video_id="abc123",
            title="Test Video",
            description="A description",
            duration=3723,
            thumbnail_url="https://example.com/thumb.jpg",
            channel="Test Channel",
            tags=["tag1", "tag2"],
        )
        assert meta.video_id == "abc123"
        assert meta.title == "Test Video"
        assert meta.description == "A description"
        assert meta.duration == 3723
        assert meta.thumbnail_url == "https://example.com/thumb.jpg"
        assert meta.channel == "Test Channel"
        assert meta.tags == ["tag1", "tag2"]

    def test_tags_default_to_empty_list(self):
        meta = VideoMetadata(
            video_id="abc",
            title="T",
            description="D",
            duration=0,
            thumbnail_url="",
            channel="C",
        )
        assert meta.tags == []

    def test_tags_default_not_shared(self):
        """Each instance gets its own default list."""
        a = VideoMetadata(
            video_id="a",
            title="",
            description="",
            duration="",
            thumbnail_url="",
            channel="",
        )
        b = VideoMetadata(
            video_id="b",
            title="",
            description="",
            duration="",
            thumbnail_url="",
            channel="",
        )
        a.tags.append("x")
        assert b.tags == []


class TestBaseClient:
    """Test BaseClient HTTP behavior."""

    def test_default_timeout(self):
        client = BaseClient()
        assert client._timeout == DEFAULT_TIMEOUT

    def test_custom_timeout(self):
        client = BaseClient(timeout=5.0)
        assert client._timeout == 5.0

    def test_build_client_returns_httpx_client(self):
        client = BaseClient()
        with client._build_client() as httpx_client:
            assert isinstance(httpx_client, httpx.Client)

    def test_build_client_uses_base_url(self):
        client = BaseClient()
        client.base_url = "https://api.example.com"
        with client._build_client() as httpx_client:
            assert str(httpx_client.base_url) == "https://api.example.com"

    def test_build_client_uses_default_headers(self):
        client = BaseClient()
        with client._build_client() as httpx_client:
            for key, value in DEFAULT_HEADERS.items():
                assert httpx_client.headers[key] == value

    @patch("sc.videos.integration.base.httpx.Client")
    def test_get_calls_httpx(self, MockClient):
        mock_response = MagicMock()
        mock_response.json.return_value = {"key": "value"}
        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.get.return_value = mock_response
        MockClient.return_value = mock_instance

        client = BaseClient()
        result = client.get("/test", params={"q": "1"})

        mock_instance.get.assert_called_once_with("/test", params={"q": "1"})
        mock_response.raise_for_status.assert_called_once()
        assert result == {"key": "value"}

    @patch("sc.videos.integration.base.httpx.Client")
    def test_get_raises_on_http_error(self, MockClient):
        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
            "404", request=MagicMock(), response=MagicMock()
        )
        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.get.return_value = mock_response
        MockClient.return_value = mock_instance

        client = BaseClient()
        with pytest.raises(httpx.HTTPStatusError):
            client.get("/missing")

    def test_fetch_metadata_raises_not_implemented(self):
        client = BaseClient()
        with pytest.raises(NotImplementedError):
            client.fetch_metadata("abc")
