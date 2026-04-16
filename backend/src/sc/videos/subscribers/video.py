"""Event subscribers for Video content lifecycle events."""

from Acquisition import aq_inner
from sc.videos.content.video import Video
from sc.videos.utils import image_from_url
from zope.globalrequest import getRequest
from zope.lifecycleevent import ObjectAddedEvent
from zope.lifecycleevent import ObjectModifiedEvent
from ZPublisher.HTTPRequest import WSGIRequest


_DEFAULT_VALUE = object()


def _update_preview_image(obj: Video, metadata: dict) -> None:
    """Download and set the preview image from ``thumbnail_url`` if absent.

    :param obj: Video content object.
    :param metadata: Raw metadata dictionary (from ``_metadata`` field).
    """
    thumbnail_url = metadata.get("thumbnail_url")
    if thumbnail_url and not obj.preview_image:
        image = image_from_url(thumbnail_url)
        obj.preview_image = image


def _update_metadata_attr(obj: Video, metadata: dict, attr_name: str) -> None:
    """Copy a single metadata value onto *obj* if it differs from the current one.

    :param obj: Video content object.
    :param metadata: Raw metadata dictionary.
    :param attr_name: Attribute name to update (e.g. ``"duration"``).
    """
    value = metadata.get(attr_name)
    obj = aq_inner(obj)
    current_value = getattr(obj, attr_name, _DEFAULT_VALUE)
    if value and current_value is not _DEFAULT_VALUE and value != current_value:
        setattr(obj, attr_name, value)


def _update_video_metadata(obj: Video, request: WSGIRequest) -> None:
    """Synchronise stored metadata fields and preview image from ``_metadata``.

    :param obj: Video content object.
    :param request: Current WSGI request (unused, reserved for future use).
    """
    metadata = obj._metadata
    if not metadata:
        return
    _update_preview_image(obj, metadata)
    for attr in ("duration", "service", "channel", "video_id", "subjects"):
        _update_metadata_attr(obj, metadata, attr)


def added(obj: Video, event: ObjectAddedEvent) -> None:
    """Post-creation handler: populate metadata fields from ``_metadata``.

    :param obj: Newly created Video.
    :param event: Lifecycle event.
    """
    request: WSGIRequest = getRequest()
    _update_video_metadata(obj, request=request)


def modified(obj: Video, event: ObjectModifiedEvent) -> None:
    """Post-modification handler: refresh metadata fields from ``_metadata``.

    :param obj: Modified Video.
    :param event: Lifecycle event.
    """
    request: WSGIRequest = getRequest()
    _update_video_metadata(obj, request=request)
