from plone.dexterity.content import Container
from plone.supermodel.model import Schema
from zope.interface import implementer


class IVideo(Schema):
    """Video content type interface"""


@implementer(IVideo)
class Video(Container):
    """Video content type"""
