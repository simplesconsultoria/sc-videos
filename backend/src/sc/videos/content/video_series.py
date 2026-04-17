"""VideoSeries content type."""

from plone.dexterity.content import Container
from plone.supermodel.model import Schema
from zope.interface import implementer


class IVideoSeries(Schema):
    """Marker interface for VideoSeries content objects."""


@implementer(IVideoSeries)
class VideoSeries(Container):
    """Dexterity container that groups Episodes into a series."""
