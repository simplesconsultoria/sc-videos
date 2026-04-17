"""Series content type."""

from plone.dexterity.content import Container
from plone.supermodel.model import Schema
from zope.interface import implementer


class ISeries(Schema):
    """Marker interface for Series content objects."""


@implementer(ISeries)
class Series(Container):
    """Dexterity container that groups Episodes into a series."""
