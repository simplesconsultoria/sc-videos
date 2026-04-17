from plone.indexer.decorator import indexer
from sc.videos.behaviors.video import IRemoteVideo
from zope.interface import Interface


@indexer(IRemoteVideo)
def video_url(obj: IRemoteVideo) -> str:
    """Return the video URL for catalog indexing.

    :param obj: Content object providing :class:`IRemoteVideo`.
    :returns: The ``videoUrl`` value, or an empty string if unset.
    """
    return str(obj.videoUrl) if obj.videoUrl else ""


@indexer(IRemoteVideo)
def duration(obj: IRemoteVideo) -> int | None:
    """Return the video duration in seconds.

    :param obj: Content object providing :class:`IRemoteVideo`.
    :returns: Duration in seconds.
    """
    value: int | None = obj.duration or None
    return value


@indexer(Interface)
def has_video(obj) -> bool:
    """Return True if the object provides IRemoteVideo.

    :param obj: Any content object.
    :returns: True if the object has a video, False otherwise.
    """
    return IRemoteVideo.providedBy(obj)
