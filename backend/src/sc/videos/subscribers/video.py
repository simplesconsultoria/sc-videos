from sc.videos.content.video import Video
from sc.videos.utils import image_from_url
from zope.globalrequest import getRequest
from zope.lifecycleevent import ObjectAddedEvent
from zope.lifecycleevent import ObjectModifiedEvent
from ZPublisher.HTTPRequest import WSGIRequest


def _update_video_metadata(obj: Video, request: WSGIRequest):
    """Update video metadata."""
    metadata = obj._metadata
    if not metadata:
        return
    thumbnail_url = metadata.get("thumbnail_url")
    if not obj.preview_image:
        image = image_from_url(thumbnail_url)
        obj.preview_image = image


def added(obj: Video, event: ObjectAddedEvent):
    """Post creation handler for Video."""
    request: WSGIRequest = getRequest()
    _update_video_metadata(obj, request=request)


def modified(obj: Video, event: ObjectModifiedEvent):
    """Post modification handler for Video."""
    request: WSGIRequest = getRequest()
    _update_video_metadata(obj, request=request)
