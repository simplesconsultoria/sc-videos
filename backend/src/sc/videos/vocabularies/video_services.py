"""Vocabularies exposing registered video service providers."""

from Products.CMFCore.PortalContent import PortalContent
from sc.videos.utils import get_video_services
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def VideoServicesVocabulary(context: PortalContent) -> SimpleVocabulary:
    """Build a vocabulary of available video services.

    :param context: The current content object (unused, required by factory).
    :returns: Vocabulary with one term per registered provider.
    """
    terms = [
        SimpleTerm(
            value=metadata_provider.id,
            token=metadata_provider.id,
            title=metadata_provider.name,
        )
        for metadata_provider in get_video_services()
    ]
    return SimpleVocabulary(terms)
