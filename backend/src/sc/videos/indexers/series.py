"""Indexers for Series-related catalog queries."""

from plone import api
from plone.indexer.decorator import indexer
from sc.videos.content.episode import Episode
from sc.videos.content.episode import IEpisode
from sc.videos.content.series import ISeries


@indexer(IEpisode)
def series(obj: Episode) -> str:
    """Return the UUID of the nearest parent Series.

    Traverses up the content hierarchy until it finds an object
    providing ISeries. Returns the Series UUID or raises
    AttributeError if no parent Series is found.

    :param obj: Any content object.
    :returns: UUID of the nearest parent Series.
    """
    portal = api.portal.get()
    series = api.content.iter_ancestors(obj, interface=ISeries, stop_at=portal)
    for serie in series:
        uuid = api.content.get_uuid(serie)
        return uuid
    return ""
