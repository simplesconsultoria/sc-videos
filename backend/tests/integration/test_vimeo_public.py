"""Tests for sc.videos.integration.vimeo.public."""

from sc.videos.integration.base import VideoMetadata
from sc.videos.integration.vimeo.public import VimeoPublicClient
from unittest.mock import patch

import pytest


SAMPLE_OEMBED_RESPONSE = {
    "title": "Big Buck Bunny",
    "author_name": "Blender Foundation",
    "description": "A short animation.",
    "duration": 596,
    "thumbnail_url": "https://i.vimeocdn.com/video/123.jpg",
    "type": "video",
    "provider_name": "Vimeo",
}


class TestVimeoPublicClient:
    """Test VimeoPublicClient.fetch_metadata."""

    @pytest.fixture
    def client(self):
        return VimeoPublicClient()

    @patch.object(VimeoPublicClient, "get")
    def test_fetch_metadata(self, mock_get, client):
        mock_get.return_value = SAMPLE_OEMBED_RESPONSE
        meta = client.fetch_metadata("123456789")

        assert isinstance(meta, VideoMetadata)
        assert meta.video_id == "123456789"
        assert meta.title == "Big Buck Bunny"
        assert meta.channel == "Blender Foundation"
        assert meta.description == "A short animation."
        assert meta.duration == 596
        assert meta.thumbnail_url == "https://i.vimeocdn.com/video/123.jpg"
        assert meta.tags == []

    @patch.object(VimeoPublicClient, "get")
    def test_fetch_metadata_passes_correct_params(self, mock_get, client):
        mock_get.return_value = SAMPLE_OEMBED_RESPONSE
        client.fetch_metadata("123456789")
        mock_get.assert_called_once_with(
            "/api/oembed.json",
            params={"url": "https://vimeo.com/123456789"},
        )

    @patch.object(VimeoPublicClient, "get")
    def test_fetch_metadata_missing_fields(self, mock_get, client):
        mock_get.return_value = {}
        meta = client.fetch_metadata("123")
        assert meta.title == ""
        assert meta.channel == ""
        assert meta.description == ""
        assert meta.duration == 0
        assert meta.thumbnail_url == ""

    @patch.object(VimeoPublicClient, "get")
    def test_fetch_metadata_null_description(self, mock_get, client):
        mock_get.return_value = {**SAMPLE_OEMBED_RESPONSE, "description": None}
        meta = client.fetch_metadata("123")
        assert meta.description == ""

    def test_base_url(self, client):
        assert client.base_url == "https://vimeo.com"
