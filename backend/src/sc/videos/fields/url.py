from sc.videos import _
from sc.videos.integration import resolve_url
from zope.interface import implementer
from zope.schema import URI
from zope.schema.interfaces import IFromUnicode
from zope.schema.interfaces import INativeStringLine
from zope.schema.interfaces import ValidationError


class IVideoURL(INativeStringLine):
    """A field containing an external video URL."""


class InvalidVideoURL(ValidationError):
    __doc__ = _("""The address is not a valid video URL.""")


@implementer(IVideoURL, IFromUnicode)
class VideoURL(URI):
    """Video URL schema field"""

    def _validate(self, value):
        super()._validate(value)
        if resolve_url(value):
            return

        raise InvalidVideoURL(value)

    def fromUnicode(self, value) -> str:
        v = str(value.strip())
        self.validate(v)
        return v
