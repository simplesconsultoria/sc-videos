"""Control Panel Interfaces."""

from sc.videos import _
from zope import schema
from zope.interface import Interface


class ISCVideoSettings(Interface):
    """Video integration settings."""

    youtube_api_enabled = schema.Bool(
        title=_("Enable YouTube API (Authenticated)"),
        description=_("Enable or disable YouTube API integration."),
        required=False,
        default=False,
    )

    youtube_api_key = schema.TextLine(
        title=_("YouTube API Key"),
        description=_("Enter your YouTube API key for video integration."),
        required=False,
        default="default",
    )
