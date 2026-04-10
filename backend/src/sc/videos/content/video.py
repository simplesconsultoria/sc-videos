from plone.dexterity.content import Container
from plone.supermodel.model import Schema
from sc.videos import _
from zope import schema
from zope.interface import implementer


class IVideo(Schema):
    """Video content type interface"""

    remoteUrl = schema.URI(
        title=_("Video URL"),
        description=_("Enter a video URL (YouTube, Vimeo)"),
        required=True,
    )

    length = schema.TextLine(
        title=_("label_video_length", default="Video Length"),
        description=_(
            "help_video_length",
            default="Free text field to enter the length of the video. "
            "This information is displayed on the video page and in overviews. "
            'The field should always be filled out in the format "00:00:00" '
            "(hours:minutes:seconds).",
        ),
        required=False,
    )


@implementer(IVideo)
class Video(Container):
    """Video content type"""
