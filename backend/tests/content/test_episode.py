from sc.videos.content.episode import Episode

import pytest


SERIES_ADD_PERMISSION = "sc.videos: Add VideoSeries"
DEFAULT_ROLES = ["Manager", "Site Administrator", "Editor", "Contributor"]


@pytest.fixture
def portal_type() -> str:
    return "Episode"


@pytest.fixture
def enable_series(portal):
    """Enable Series by granting add permission (mimics enable_series=True)."""
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


@pytest.fixture
def series(content_factory, portal, enable_series):
    return content_factory(
        portal,
        {
            "type": "VideoSeries",
            "id": "my-series",
            "title": "My Series",
        },
    )


@pytest.fixture
def payload() -> dict:
    return {
        "type": "Episode",
        "id": "episode-1",
        "title": "Episode 1",
        "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }


class TestEpisodeCreation:
    @pytest.fixture(autouse=True)
    def _setup(self, series):
        self.container = series

    def test_create(self, content_factory, payload):
        content = content_factory(self.container, payload)
        assert content.portal_type == "Episode"
        assert isinstance(content, Episode)

    @pytest.mark.parametrize(
        "role,expected",
        [
            ["Manager", True],
            ["Site Administrator", True],
            ["Owner", False],
            ["Contributor", True],
            ["Reader", False],
            ["Anonymous", False],
        ],
    )
    def test_create_permission(
        self, roles_permission_on, permission, role: str, expected: bool
    ):
        roles = roles_permission_on(permission, self.container)
        assert (role in roles) is expected
