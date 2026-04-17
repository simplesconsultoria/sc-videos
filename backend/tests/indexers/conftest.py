from plone import api
from plone.dexterity.content import DexterityContent
from zope.event import notify
from zope.lifecycleevent import ObjectModifiedEvent

import pytest


@pytest.fixture(scope="class")
def portal(portal_class):
    yield portal_class


@pytest.fixture(scope="class")
def video(content_factory, portal) -> DexterityContent:
    """Create a Video with duration set."""
    content = content_factory(
        portal,
        {
            "type": "Video",
            "id": "test-video",
            "title": "Test Video",
            "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
    )
    content.duration = 300  # 5 minutes
    notify(ObjectModifiedEvent(content))
    return content


@pytest.fixture
def catalog(portal):
    return api.portal.get_tool("portal_catalog")
