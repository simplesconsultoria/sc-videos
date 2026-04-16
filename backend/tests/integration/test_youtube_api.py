"""Tests for sc.videos.integration.youtube.api."""

from sc.videos.integration.base import VideoMetadata
from sc.videos.integration.youtube.api import _best_thumbnail
from sc.videos.integration.youtube.api import _parse_iso8601_duration
from sc.videos.integration.youtube.api import YouTubeAPIClient
from unittest.mock import patch

import pytest


class TestParseISO8601Duration:
    """Test _parse_iso8601_duration conversion."""

    @pytest.mark.parametrize(
        "raw,expected",
        [
            ("PT1H2M3S", 3723),
            ("PT10M30S", 630),
            ("PT5S", 5),
            ("PT1H", 3600),
            ("PT30M", 1800),
            ("PT0S", 0),
            ("PT2H0M0S", 7200),
        ],
    )
    def test_valid_durations(self, raw: str, expected: int):
        assert _parse_iso8601_duration(raw) == expected

    @pytest.mark.parametrize(
        "raw",
        [
            "",
            "invalid",
            "P1D",
        ],
    )
    def test_invalid_durations_return_zero(self, raw: str):
        assert _parse_iso8601_duration(raw) == 0


class TestBestThumbnail:
    """Test _best_thumbnail resolution selection."""

    def test_picks_maxres_first(self):
        thumbs = {
            "default": {"url": "http://d.jpg"},
            "maxres": {"url": "http://max.jpg"},
            "high": {"url": "http://h.jpg"},
        }
        assert _best_thumbnail(thumbs) == "http://max.jpg"

    def test_falls_back_to_standard(self):
        thumbs = {
            "standard": {"url": "http://s.jpg"},
            "medium": {"url": "http://m.jpg"},
        }
        assert _best_thumbnail(thumbs) == "http://s.jpg"

    def test_falls_back_to_default(self):
        thumbs = {"default": {"url": "http://d.jpg"}}
        assert _best_thumbnail(thumbs) == "http://d.jpg"

    def test_empty_thumbnails_return_empty_string(self):
        assert _best_thumbnail({}) == ""


# Sample API response fixture
SAMPLE_API_RESPONSE = {
    "items": [
        {
            "snippet": {
                "title": "Never Gonna Give You Up",
                "description": "The official video for Rick Astley",
                "channelTitle": "Rick Astley",
                "tags": ["rick", "astley"],
                "thumbnails": {
                    "default": {"url": "http://d.jpg"},
                    "high": {"url": "http://h.jpg"},
                    "maxres": {"url": "http://max.jpg"},
                },
            },
            "contentDetails": {
                "duration": "PT3M33S",
            },
        }
    ]
}


class TestYouTubeAPIClient:
    """Test YouTubeAPIClient.fetch_metadata."""

    @pytest.fixture
    def client(self):
        return YouTubeAPIClient(api_key="test-key")

    @patch.object(YouTubeAPIClient, "get")
    def test_fetch_metadata(self, mock_get, client):
        mock_get.return_value = SAMPLE_API_RESPONSE
        meta = client.fetch_metadata("dQw4w9WgXcQ")

        assert isinstance(meta, VideoMetadata)
        assert meta.video_id == "dQw4w9WgXcQ"
        assert meta.title == "Never Gonna Give You Up"
        assert meta.description == "The official video for Rick Astley"
        assert meta.duration == 213
        assert meta.thumbnail_url == "http://max.jpg"
        assert meta.channel == "Rick Astley"
        assert meta.tags == ["rick", "astley"]

    @patch.object(YouTubeAPIClient, "get")
    def test_fetch_metadata_passes_correct_params(self, mock_get, client):
        mock_get.return_value = SAMPLE_API_RESPONSE
        client.fetch_metadata("abc123")
        mock_get.assert_called_once_with(
            "/videos",
            params={
                "id": "abc123",
                "key": "test-key",
                "part": "snippet,contentDetails",
            },
        )

    @patch.object(YouTubeAPIClient, "get")
    def test_fetch_metadata_video_not_found(self, mock_get, client):
        mock_get.return_value = {"items": []}
        with pytest.raises(ValueError, match="Video not found: missing"):
            client.fetch_metadata("missing")

    @patch.object(YouTubeAPIClient, "get")
    def test_fetch_metadata_no_items_key(self, mock_get, client):
        mock_get.return_value = {}
        with pytest.raises(ValueError, match="Video not found"):
            client.fetch_metadata("missing")

    @patch.object(YouTubeAPIClient, "get")
    def test_fetch_metadata_missing_optional_fields(self, mock_get, client):
        mock_get.return_value = {
            "items": [
                {
                    "snippet": {"thumbnails": {}},
                    "contentDetails": {},
                }
            ]
        }
        meta = client.fetch_metadata("abc")
        assert meta.title == ""
        assert meta.description == ""
        assert meta.channel == ""
        assert meta.tags == []
        assert meta.thumbnail_url == ""
        assert meta.duration == 0

    def test_api_key_stored(self, client):
        assert client._api_key == "test-key"

    def test_base_url(self, client):
        assert client.base_url == "https://www.googleapis.com/youtube/v3"
