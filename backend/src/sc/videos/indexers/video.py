from plone.indexer.decorator import indexer
from sc.videos.behaviors.video import IRemoteVideo


@indexer(IRemoteVideo)
def video_url(obj: IRemoteVideo) -> str:
    """Index object videoUrl."""
    videoUrl: str = str(obj.videoUrl) if obj.videoUrl else ""
    return videoUrl
