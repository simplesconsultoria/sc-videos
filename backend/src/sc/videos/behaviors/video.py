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
        "video-metadata", label=_("Video Metadata"), fields=["duration", "_metadata"]
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
