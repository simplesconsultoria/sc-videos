"""Tests for sc.videos.utils."""

from sc.videos.integration.base import MetadataProvider
from sc.videos.utils import get_video_services
from sc.videos.utils import image_from_url
from unittest.mock import MagicMock
from unittest.mock import patch

import httpx
import pytest


class TestGetVideoServices:
    """Test get_video_services with the integration layer."""

    @pytest.fixture(autouse=True)
    def _with_integration(self, integration):
        """Ensure the Zope component registry is available."""

    def test_returns_sequence(self):
        result = get_video_services()
        assert hasattr(result, "__iter__")

    def test_contains_youtube(self):
        ids = [p.id for p in get_video_services()]
        assert "youtube" in ids

    def test_contains_vimeo(self):
        ids = [p.id for p in get_video_services()]
        assert "vimeo" in ids

    def test_all_are_metadata_providers(self):
        for provider in get_video_services():
            assert isinstance(provider, MetadataProvider)

    def test_each_has_url_pattern(self):
        for provider in get_video_services():
            assert hasattr(provider, "url_pattern")
            assert hasattr(provider.url_pattern, "search")


class TestImageFromUrl:
    """Test image_from_url with mocked HTTP responses."""

    @pytest.fixture(autouse=True)
    def _with_integration(self, integration):
        """NamedBlobImage requires the Zope component registry."""

    @patch.object(httpx, "get")
    def test_returns_named_blob_image(self, mock_get):
        mock_response = MagicMock()
        mock_response.headers = {"Content-Type": "image/jpeg"}
        mock_response.content = b"\xff\xd8\xff\xe0"
        mock_get.return_value = mock_response

        result = image_from_url("https://example.com/thumb.jpg")

        assert result.contentType == "image/jpeg"
        assert result.data == b"\xff\xd8\xff\xe0"
        assert result.filename == "thumb.jpg"

    @patch.object(httpx, "get")
    def test_extracts_filename_from_url(self, mock_get):
        mock_response = MagicMock()
        mock_response.headers = {"Content-Type": "image/png"}
        mock_response.content = b"\x89PNG"
        mock_get.return_value = mock_response

        result = image_from_url("https://cdn.example.com/path/to/preview.png")

        assert result.filename == "preview.png"

    @patch.object(httpx, "get")
    def test_raises_on_non_image_content_type(self, mock_get):
        mock_response = MagicMock()
        mock_response.headers = {"Content-Type": "text/html"}
        mock_response.content = b"<html></html>"
        mock_get.return_value = mock_response

        with pytest.raises(ValueError, match="does not point to an image"):
            image_from_url("https://example.com/page.html")

    @patch.object(httpx, "get")
    def test_raises_on_empty_content_type(self, mock_get):
        mock_response = MagicMock()
        mock_response.headers = {}
        mock_response.content = b"data"
        mock_get.return_value = mock_response

        with pytest.raises(ValueError, match="does not point to an image"):
            image_from_url("https://example.com/unknown")

    @patch.object(httpx, "get")
    def test_passes_timeout(self, mock_get):
        mock_response = MagicMock()
        mock_response.headers = {"Content-Type": "image/jpeg"}
        mock_response.content = b"\xff\xd8"
        mock_get.return_value = mock_response

        image_from_url("https://example.com/img.jpg")

        mock_get.assert_called_once_with("https://example.com/img.jpg", timeout=10.0)
