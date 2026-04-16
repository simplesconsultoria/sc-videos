"""JSON schema provider for the VideoURL field."""

from plone.restapi.types.adapters import TextLineJsonSchemaProvider
from plone.restapi.types.interfaces import IJsonSchemaProvider
from sc.videos.fields.url import IVideoURL
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface


@adapter(IVideoURL, Interface, Interface)
@implementer(IJsonSchemaProvider)
class VideoURLJsonSchemaProvider(TextLineJsonSchemaProvider):
    """Provide ``plone.restapi`` JSON schema for :class:`VideoURL` fields."""

    def get_widget(self) -> str:
        """Return the Volto widget identifier.

        :returns: Widget name used by the frontend.
        """
        return "VideoURL"

    def get_factory(self) -> str:
        """Return the factory name for schema generation.

        :returns: Factory identifier.
        """
        return "VideoURL"
