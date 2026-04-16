"""Tests for sc.videos.integration.youtube.public."""

from sc.videos.integration.base import VideoMetadata
from sc.videos.integration.youtube.public import _build_hq_thumbnail
from sc.videos.integration.youtube.public import YouTubePublicClient
from unittest.mock import patch

import pytest


SAMPLE_OEMBED_RESPONSE = {
    "title": "Never Gonna Give You Up",
    "author_name": "Rick Astley",
    "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    "type": "video",
    "provider_name": "YouTube",
}


class TestYouTubePublicClient:
    """Test YouTubePublicClient.fetch_metadata."""

    @pytest.fixture
    def client(self):
        return YouTubePublicClient()

    @patch.object(YouTubePublicClient, "get")
    def test_fetch_metadata(self, mock_get, client):
        mock_get.return_value = SAMPLE_OEMBED_RESPONSE
        meta = client.fetch_metadata("dQw4w9WgXcQ")

        assert isinstance(meta, VideoMetadata)
        assert meta.video_id == "dQw4w9WgXcQ"
        assert meta.title == "Never Gonna Give You Up"
        assert meta.channel == "Rick Astley"
        assert meta.description == ""
        assert meta.duration == 0
        assert meta.tags == []

    @patch.object(YouTubePublicClient, "get")
    def test_fetch_metadata_passes_correct_params(self, mock_get, client):
        mock_get.return_value = SAMPLE_OEMBED_RESPONSE
        client.fetch_metadata("dQw4w9WgXcQ")
        mock_get.assert_called_once_with(
            "/oembed",
            params={
                "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "format": "json",
            },
        )

    @patch.object(YouTubePublicClient, "get")
    def test_fetch_metadata_missing_fields(self, mock_get, client):
        mock_get.return_value = {}
        meta = client.fetch_metadata("abc123")
        assert meta.title == ""
        assert meta.channel == ""

    @patch.object(YouTubePublicClient, "get")
    def test_fetch_metadata_thumbnail_uses_maxres(self, mock_get, client):
        mock_get.return_value = SAMPLE_OEMBED_RESPONSE
        meta = client.fetch_metadata("dQw4w9WgXcQ")
        assert (
            meta.thumbnail_url == "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
        )

    def test_base_url(self, client):
        assert client.base_url == "https://www.youtube.com"


class TestBuildHQThumbnail:
    """Test _build_hq_thumbnail helper."""

    def test_returns_maxres_url(self):
        data = {"thumbnail_url": "https://i.ytimg.com/vi/abc/hqdefault.jpg"}
        result = _build_hq_thumbnail("abc", data)
        assert result == "https://i.ytimg.com/vi/abc/maxresdefault.jpg"

    def test_falls_back_to_oembed_when_no_video_id(self):
        data = {"thumbnail_url": "https://i.ytimg.com/vi/abc/hqdefault.jpg"}
        result = _build_hq_thumbnail("", data)
        assert result == "https://i.ytimg.com/vi/abc/hqdefault.jpg"

    def test_empty_data(self):
        result = _build_hq_thumbnail("abc", {})
        assert result == "https://i.ytimg.com/vi/abc/maxresdefault.jpg"
