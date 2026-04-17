from plone import api
from plone.dexterity.content import DexterityContent
from zope.event import notify
from zope.lifecycleevent import ObjectModifiedEvent

import pytest


@pytest.fixture(scope="class")
def portal(portal_class):
    yield portal_class


@pytest.fixture
def registry(portal):
    return api.portal.get_tool("portal_registry")


@pytest.fixture(scope="class")
def videos(content_factory, portal) -> dict[str, DexterityContent]:
    """Create videos with different durations for querybuilder tests."""
    items = {}
    for video_id, title, duration in [
        ("short-video", "Short Video", 300),
        ("medium-video", "Medium Video", 900),
        ("long-video", "Long Video", 2400),
        ("very-long-video", "Very Long Video", 5400),
    ]:
        content = content_factory(
            portal,
            {
                "type": "Video",
                "id": video_id,
                "title": title,
                "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
        )
        content.duration = duration
        notify(ObjectModifiedEvent(content))
        items[video_id] = content
    return items
