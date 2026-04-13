from plone.dexterity.fti import DexterityFTI
from plone.dexterity.utils import resolveDottedName
from zope.component import createObject

import pytest


@pytest.fixture(scope="class")
def portal(portal_class):
    yield portal_class


class TestContentTypeFTI:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    @pytest.mark.parametrize(
        "portal_type,attr,expected",
        [
            ("Video", "title", "Video"),
            ("Video", "description", "A video content"),
            ("Video", "global_allow", True),
            ("Video", "filter_content_types", True),
            ("Video", "allowed_content_types", ("Image",)),
            (
                "Video",
                "behaviors",
                (
                    "sc.videos.remotevideo",
                    "plone.basic",
                    "plone.namefromtitle",
                    "plone.richtext",
                    "volto.preview_image",
                    "plone.categorization",
                    "volto.navtitle",
                    "plone.versioning",
                    "plone.excludefromnavigation",
                    "plone.shortname",
                ),
            ),
        ],
    )
    def test_fti(self, get_fti, portal_type: str, attr: str, expected):
        """Test FTI values."""
        fti: DexterityFTI = get_fti(portal_type)

        assert isinstance(fti, DexterityFTI)
        assert getattr(fti, attr) == expected

    @pytest.mark.parametrize(
        "portal_type",
        [
            "Video",
        ],
    )
    def test_factory(self, get_fti, portal_type: str):
        fti = get_fti(portal_type)
        factory = fti.factory
        klass = resolveDottedName(fti.klass)
        obj = createObject(factory)
        assert obj is not None
        assert isinstance(obj, klass)
        assert obj.portal_type == portal_type
