"""Event subscribers for IRemoteVideo content lifecycle events."""

from plone.exportimport.interfaces import IExportImportRequestMarker
from sc.videos.behaviors.video import IRemoteVideo
from sc.videos.utils import metadata_for_content
from zope.globalrequest import getRequest
from zope.lifecycleevent import ObjectAddedEvent
from zope.lifecycleevent import ObjectModifiedEvent
from ZPublisher.HTTPRequest import HTTPRequest


def _is_import_process(request: HTTPRequest | None) -> bool:
    """Check if the current request is an import process."""
    if request is None:
        return False
    return IExportImportRequestMarker.providedBy(request)


def _update_metadata(content: IRemoteVideo) -> None:
    """Fetch and apply metadata unless running inside an import."""
    request: HTTPRequest | None = getRequest()
    if not _is_import_process(request):
        metadata_for_content(content)


def added(content: IRemoteVideo, event: ObjectAddedEvent) -> None:
    """Post-creation handler: populate metadata fields.

    :param content: Newly created content with IRemoteVideo behavior.
    :param event: Lifecycle event.
    """
    _update_metadata(content)


def modified(content: IRemoteVideo, event: ObjectModifiedEvent) -> None:
    """Post-modification handler: refresh metadata fields.

    :param content: Modified content with IRemoteVideo behavior.
    :param event: Lifecycle event.
    """
    _update_metadata(content)
