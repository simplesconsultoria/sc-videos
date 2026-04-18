"""Episode content type."""

from plone.app.event.base import default_timezone
from plone.app.z3cform.widgets.datetime import DatetimeFieldWidget
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.supermodel.model import Schema
from sc.videos import _
from zope import schema
from zope.interface import implementer


class IEpisode(Schema):
    """Marker interface for Episode content objects."""

    start = schema.Datetime(title=_("Release time"), required=False)
    directives.widget(
        "start",
        DatetimeFieldWidget,
        default_timezone=default_timezone,
        klass="event_start",
    )


@implementer(IEpisode)
class Episode(Container):
    """Dexterity container that represents a single episode within a VideoSeries."""
