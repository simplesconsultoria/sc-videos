"""Event subscribers for VideoSeries content lifecycle events."""

from sc.videos import logger
from sc.videos import permissions
from sc.videos.content.video_series import VideoSeries
from zope.lifecycleevent import ObjectAddedEvent


PERMISSIONS = (
    (permissions.EPISODE_ADD_PERMISSION, permissions.DEFAULT_ADD_ROLES),
    (permissions.SERIES_ADD_PERMISSION, ()),
)


def added(obj: VideoSeries, event: ObjectAddedEvent) -> None:
    """Post-creation handler: grant Episode add permission on the VideoSeries.

    :param obj: Newly created VideoSeries.
    :param event: Lifecycle event.
    """
    for permission, roles in PERMISSIONS:
        obj.manage_permission(
            permission,
            roles=roles,
            acquire=False,
        )
        logger.info(
            "Granted permission '%s' on VideoSeries '%s' to roles: %s",
            permission,
            obj.absolute_url(),
            ", ".join(roles) if roles else "-",
        )
