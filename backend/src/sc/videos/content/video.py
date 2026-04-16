"""Video content type."""

from plone.dexterity.content import Container
from plone.supermodel.model import Schema
from zope.interface import implementer


class IVideo(Schema):
    """Marker interface for Video content objects."""


@implementer(IVideo)
class Video(Container):
    """Dexterity container that represents an external video."""
