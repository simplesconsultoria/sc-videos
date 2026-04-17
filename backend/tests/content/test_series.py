from AccessControl.PermissionRole import rolesForPermissionOn

import pytest


EPISODE_ADD_PERMISSION = "sc.videos: Add Episode"
SERIES_ADD_PERMISSION = "sc.videos: Add Series"
DEFAULT_ROLES = ["Manager", "Site Administrator", "Editor", "Contributor"]


@pytest.fixture
def portal_type() -> str:
    return "Series"


@pytest.fixture
def payload() -> dict:
    return {
        "type": "Series",
        "id": "my-series",
        "title": "My Series",
        "description": "A test series",
    }


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


class TestSeriesCreation:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, enable_series):
        self.container = portal

    def test_create(self, content_factory, payload):
        content = content_factory(self.container, payload)
        assert content.portal_type == "Series"

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


class TestSeriesDisabledByDefault:
    """Test that Series add permission is not granted by default."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def test_series_add_permission_not_granted(self):
        roles = rolesForPermissionOn(SERIES_ADD_PERMISSION, self.portal)
        for role in DEFAULT_ROLES:
            assert role not in roles


class TestSeriesEpisodePermission:
    """Test that creating a Series grants Episode add permission."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, content_factory, payload, enable_series):
        self.portal = portal
        self.series = content_factory(portal, payload)

    def test_episode_permission_granted_on_series(self):
        roles = rolesForPermissionOn(EPISODE_ADD_PERMISSION, self.series)
        assert "Manager" in roles
        assert "Contributor" in roles

    def test_episode_permission_not_granted_on_portal(self):
        roles = rolesForPermissionOn(EPISODE_ADD_PERMISSION, self.portal)
        assert "Contributor" not in roles

    def test_series_add_blocked_inside_series(self):
        """Series creation subscriber removes Series add permission inside itself."""
        roles = rolesForPermissionOn(SERIES_ADD_PERMISSION, self.series)
        for role in DEFAULT_ROLES:
            assert role not in roles
