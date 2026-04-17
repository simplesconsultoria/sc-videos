from plone.uuid.interfaces import IUUID
from zope.event import notify
from zope.lifecycleevent import ObjectModifiedEvent

import pytest


SERIES_ADD_PERMISSION = "sc.videos: Add VideoSeries"
DEFAULT_ROLES = ["Manager", "Site Administrator", "Editor", "Contributor"]


@pytest.fixture(scope="class")
def enable_series(portal):
    """Enable Series by granting add permission."""
    portal.manage_permission(
        SERIES_ADD_PERMISSION,
        roles=DEFAULT_ROLES,
        acquire=False,
    )
    yield
    portal.manage_permission(
        SERIES_ADD_PERMISSION,
        roles=(),
        acquire=False,
    )


@pytest.fixture(scope="class")
def series(content_factory, portal, enable_series):
    return content_factory(
        portal,
        {
            "type": "VideoSeries",
            "id": "test-series",
            "title": "Test Series",
        },
    )


@pytest.fixture(scope="class")
def episode(content_factory, series):
    content = content_factory(
        series,
        {
            "type": "Episode",
            "id": "test-episode",
            "title": "Test Episode",
            "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
    )
    content.duration = 300
    notify(ObjectModifiedEvent(content))
    return content


class TestSeriesIndex:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, catalog, series, episode):
        self.portal = portal
        self.catalog = catalog
        self.series = series
        self.episode = episode

    def test_index_exists(self):
        assert "series" in self.catalog.indexes()

    def test_episode_indexed_with_series_uuid(self):
        series_uuid = IUUID(self.series)
        brains = self.catalog(portal_type="Episode", series=series_uuid)
        assert len(brains) == 1
        assert brains[0].Title == "Test Episode"

    def test_series_itself_not_indexed(self):
        """The Series itself has no parent Series, so it should not appear."""
        series_uuid = IUUID(self.series)
        brains = self.catalog(series=series_uuid)
        titles = [b.Title for b in brains]
        assert "Test Series" not in titles

    def test_video_outside_series_not_indexed(self, content_factory):
        content_factory(
            self.portal,
            {
                "type": "Video",
                "id": "standalone-video",
                "title": "Standalone Video",
                "videoUrl": "https://vimeo.com/123456789",
            },
        )
        series_uuid = IUUID(self.series)
        brains = self.catalog(series=series_uuid)
        titles = [b.Title for b in brains]
        assert "Standalone Video" not in titles
