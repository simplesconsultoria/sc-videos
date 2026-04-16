"""Tests for sc.videos.integration.resolve_url."""

from sc.videos.integration import resolve_url
from sc.videos.integration import VideoReference

import pytest


class TestResolveYouTubeURLs:
    """Test resolve_url with YouTube URLs."""

    @pytest.mark.parametrize(
        "url,expected_id",
        [
            ("https://www.youtube.com/watch?v=ATy8ALW63rQ", "ATy8ALW63rQ"),
            ("https://youtube.com/watch?v=ATy8ALW63rQ", "ATy8ALW63rQ"),
            ("https://www.youtube.com/watch?v=ATy8ALW63rQ&t=120", "ATy8ALW63rQ"),
            ("https://youtu.be/ATy8ALW63rQ", "ATy8ALW63rQ"),
            ("https://www.youtube.com/embed/ATy8ALW63rQ", "ATy8ALW63rQ"),
            ("https://www.youtube.com/v/ATy8ALW63rQ", "ATy8ALW63rQ"),
            ("https://www.youtube.com/shorts/ATy8ALW63rQ", "ATy8ALW63rQ"),
            ("https://www.youtube.com/live/ATy8ALW63rQ", "ATy8ALW63rQ"),
        ],
    )
    def test_youtube_urls(self, url: str, expected_id: str):
        result = resolve_url(url)
        assert result == VideoReference(service="youtube", video_id=expected_id)

    def test_youtube_service_name(self):
        result = resolve_url("https://youtu.be/ATy8ALW63rQ")
        assert result is not None
        assert result.service == "youtube"


class TestResolveVimeoURLs:
    """Test resolve_url with Vimeo URLs."""

    @pytest.mark.parametrize(
        "url,expected_id",
        [
            ("https://vimeo.com/123456789", "123456789"),
            ("https://www.vimeo.com/123456789", "123456789"),
            ("https://player.vimeo.com/video/123456789", "123456789"),
        ],
    )
    def test_vimeo_urls(self, url: str, expected_id: str):
        result = resolve_url(url)
        assert result == VideoReference(service="vimeo", video_id=expected_id)

    def test_vimeo_service_name(self):
        result = resolve_url("https://vimeo.com/123456789")
        assert result is not None
        assert result.service == "vimeo"


class TestResolveUnknownURLs:
    """Test resolve_url with unsupported or invalid URLs."""

    @pytest.mark.parametrize(
        "url",
        [
            "https://www.dailymotion.com/video/x7tgad0",
            "https://example.com/video/123",
            "not-a-url",
            "",
        ],
    )
    def test_unknown_urls_return_none(self, url: str):
        assert resolve_url(url) is None


class TestVideoReference:
    """Test the VideoReference dataclass."""

    def test_is_frozen(self):
        ref = VideoReference(service="youtube", video_id="abc")
        with pytest.raises(AttributeError):
            ref.service = "vimeo"

    def test_equality(self):
        a = VideoReference(service="youtube", video_id="abc")
        b = VideoReference(service="youtube", video_id="abc")
        assert a == b

    def test_inequality(self):
        a = VideoReference(service="youtube", video_id="abc")
        b = VideoReference(service="vimeo", video_id="abc")
        assert a != b
