from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from sc.videos.controlpanels.controlpanel import SettingsEditForm
from sc.videos.interfaces import IBrowserLayer
from zope.interface import alsoProvides

import pytest


class TestClassicControlPanel:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, http_request):
        alsoProvides(http_request, IBrowserLayer)
        setRoles(portal, TEST_USER_ID, ["Manager"])
        self.portal = portal
        self.request = http_request

    def test_get_content(self):
        """The edit form reads the records registered by the default profile."""
        form = SettingsEditForm(self.portal, self.request)
        settings = form.getContent()
        assert settings.enable_series is False
        assert settings.youtube_api_enabled is False

    def test_get_content_follows_registry(self):
        """Values set in the registry are the ones the edit form reads."""
        api.portal.set_registry_record("sc.videos.enable_series", True)
        form = SettingsEditForm(self.portal, self.request)
        assert form.getContent().enable_series is True

    def test_view_renders(self):
        view = api.content.get_view(
            name="video-controlpanel", context=self.portal, request=self.request
        )
        html = view()
        assert "Enable Series and Episodes" in html
