from plone.autoform import directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.schema.jsonfield import JSONField
from plone.supermodel import model
from plone.supermodel.directives import fieldset
from sc.videos import _
from sc.videos.fields.url import VideoURL
from zope import schema
from zope.interface import provider


@provider(IFormFieldProvider)
class IRemoteVideo(model.Schema):
    """External video content."""

    videoUrl = VideoURL(
        title=_("Video URL"),
        description=_("Enter a video URL (YouTube, Vimeo)"),
        required=True,
    )
    directives.order_before(videoUrl="*")

    fieldset(
        "video-metadata",
        label=_("Video Metadata"),
        fields=["duration", "service", "channel", "video_id", "_metadata"],
    )

    duration = schema.Int(
        title=_("label_video_duration", default="Video Duration"),
        description=_(
            "help_video_duration",
            default="Duration of the video in seconds.",
        ),
        required=False,
        min=0,
    )

    service = schema.Choice(
        title=_("label_video_service", default="Video Service"),
        description=_(
            "help_video_service",
            default="Select the video service.",
        ),
        vocabulary="sc.videos.vocabulary.video_services",
        required=False,
    )

    channel = schema.TextLine(
        title=_("label_video_channel", default="Video Channel"),
        description=_(
            "help_video_channel",
            default="Enter the video channel",
        ),
        required=False,
        default="",
    )
    video_id = schema.ASCIILine(
        title=_("label_video_id", default="Video ID"),
        description=_(
            "help_video_id",
            default="Enter the video ID (e.g. YouTube video ID).",
        ),
        required=False,
        default="",
    )

    _metadata = JSONField(
        title=_("label_video_metadata", default="Video Metadata"),
        description=_(
            "help_video_metadata",
            default="Metadata of the video.",
        ),
        required=False,
        default={},
    )
    directives.widget(
        "_metadata",
        frontendOptions={
            "widget": "VideoMetadata",
        },
    )
    directives.read_permission(_metadata="cmf.ModifyPortalContent")
