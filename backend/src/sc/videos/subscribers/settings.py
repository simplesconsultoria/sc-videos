from plone import api
from plone.registry.events import RecordAddedEvent
from plone.registry.events import RecordModifiedEvent
from plone.registry.record import Record
from sc.videos import logger
from sc.videos import permissions


def record_handler(record: Record) -> None:
    """Generic registry record handler: log the new value."""
    if record.__name__ != "sc.videos.enable_series":
        return
    portal = api.portal.get()
    roles = permissions.DEFAULT_ADD_ROLES if record.value else ()
    portal.manage_permission(
        permissions.SERIES_ADD_PERMISSION,
        roles=roles,
        acquire=False,
    )
    action = "Enabled" if record.value else "Disabled"
    logger.info(
        "%s Series content type; granted permission '%s' on portal '%s' to roles: %s",
        action,
        permissions.SERIES_ADD_PERMISSION,
        portal.absolute_url(),
        ", ".join(roles) if roles else "-",
    )


def modified(event: RecordModifiedEvent) -> None:
    """Registry record modified handler: log the new value."""
    record_handler(event.record)


def added(event: RecordAddedEvent) -> None:
    """Registry record added handler: log the new value."""
    record_handler(event.record)
