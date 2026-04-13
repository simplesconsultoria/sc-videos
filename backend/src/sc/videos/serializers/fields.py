from plone.restapi.types.adapters import TextLineJsonSchemaProvider
from plone.restapi.types.interfaces import IJsonSchemaProvider
from sc.videos.fields.url import IVideoURL
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface


@adapter(IVideoURL, Interface, Interface)
@implementer(IJsonSchemaProvider)
class VideoURLJsonSchemaProvider(TextLineJsonSchemaProvider):
    """Serializer for the VideoURL field."""

    def get_widget(self):
        return "VideoURL"

    def get_factory(self):
        return "VideoURL"
