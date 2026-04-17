import pytest


class TestVideoUrlMetadata:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, catalog, video):
        self.portal = portal
        self.catalog = catalog
        self.video = video

    def test_metadata_exists(self):
        assert "videoUrl" in self.catalog.schema()

    def test_metadata_value(self):
        brain = self.catalog(portal_type="Video")[0]
        assert brain.videoUrl == "https://www.youtube.com/watch?v=dQw4w9WgXcQ"


class TestDurationIndex:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, catalog, video):
        self.portal = portal
        self.catalog = catalog
        self.video = video

    def test_index_exists(self):
        assert "duration" in self.catalog.indexes()

    def test_metadata_exists(self):
        assert "duration" in self.catalog.schema()

    def test_indexed_value(self):
        brains = self.catalog(portal_type="Video", duration=300)
        assert len(brains) == 1
        assert brains[0].duration == 300

    def test_less_than_query(self):
        brains = self.catalog(
            portal_type="Video", duration={"query": 600, "range": "max"}
        )
        assert len(brains) == 1

    def test_greater_than_query(self):
        brains = self.catalog(
            portal_type="Video", duration={"query": 600, "range": "min"}
        )
        assert len(brains) == 0


class TestHasVideoIndex:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, catalog, video):
        self.portal = portal
        self.catalog = catalog
        self.video = video

    def test_index_exists(self):
        assert "has_video" in self.catalog.indexes()

    def test_metadata_exists(self):
        assert "has_video" in self.catalog.schema()

    def test_video_is_indexed_as_true(self):
        brains = self.catalog(has_video=True)
        paths = [b.getPath() for b in brains]
        assert f"/plone/{self.video.id}" in paths

    def test_brain_has_video_value(self):
        brain = self.catalog(portal_type="Video")[0]
        assert brain.has_video is True

    def test_non_video_content(self, content_factory):
        content_factory(
            self.portal,
            {
                "type": "Document",
                "id": "test-doc",
                "title": "A Document",
            },
        )
        brains = self.catalog(portal_type="Document", has_video=True)
        assert len(brains) == 0
