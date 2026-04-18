"""Indexers for VideoSeries-related catalog queries."""

from plone import api
from plone.indexer.decorator import indexer
from sc.videos.content.episode import Episode
from sc.videos.content.episode import IEpisode
from sc.videos.content.video_series import IVideoSeries


@indexer(IEpisode)
def videoseries(obj: Episode) -> str:
    """Return the UUID of the nearest parent VideoSeries.

    Traverses up the content hierarchy until it finds an object
    providing IVideoSeries. Returns the VideoSeries UUID or raises
    AttributeError if no parent VideoSeries is found.

    :param obj: Any content object.
    :returns: UUID of the nearest parent VideoSeries.
    """
    portal = api.portal.get()
    ancestors = api.content.iter_ancestors(obj, interface=IVideoSeries, stop_at=portal)
    for ancestor in ancestors:
        uuid = api.content.get_uuid(ancestor)
        return uuid
    return ""
