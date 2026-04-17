"""Episode content type."""

from plone.dexterity.content import Container
from plone.supermodel.model import Schema
from zope.interface import implementer


class IEpisode(Schema):
    """Marker interface for Episode content objects."""


@implementer(IEpisode)
class Episode(Container):
    """Dexterity container that represents a single episode within a VideoSeries."""
