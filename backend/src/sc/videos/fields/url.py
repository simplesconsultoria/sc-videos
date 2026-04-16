"""Video URL schema field with provider validation."""

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
    """URI field that additionally validates the URL against known video providers."""

    def _validate(self, value: str) -> None:
        """Validate *value* is a well-formed URI pointing to a known provider.

        :param value: URL string to validate.
        :raises InvalidVideoURL: If the URL does not match any known provider.
        """
        super()._validate(value)
        if resolve_url(value):
            return
        raise InvalidVideoURL(value)

    def fromUnicode(self, value: str) -> str:
        """Convert and validate a unicode string to a video URL.

        :param value: Raw user input.
        :returns: Stripped, validated URL string.
        """
        v = str(value.strip())
        self.validate(v)
        return v
