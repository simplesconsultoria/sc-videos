from plone.indexer.decorator import indexer
from sc.videos.behaviors.video import IRemoteVideo


@indexer(IRemoteVideo)
def video_url(obj: IRemoteVideo) -> str:
    """Return the video URL for catalog indexing.

    :param obj: Content object providing :class:`IRemoteVideo`.
    :returns: The ``videoUrl`` value, or an empty string if unset.
    """
    return str(obj.videoUrl) if obj.videoUrl else ""
