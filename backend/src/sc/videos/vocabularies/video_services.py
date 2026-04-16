"""Vocabularies exposing configured connections to z3c.form."""

from collections.abc import Sequence
from sc.videos.integration.base import MetadataProvider
from sc.videos.interfaces import IVideoMetadataProvider
from zope.component import getAllUtilitiesRegisteredFor
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


def get_video_services() -> Sequence[type[MetadataProvider]]:
    """Get all configured video services."""
    utilities = getAllUtilitiesRegisteredFor(IVideoMetadataProvider)
    return utilities


@provider(IVocabularyFactory)
def VideoServicesVocabulary(context: object) -> SimpleVocabulary:
    """All connections (unfiltered)."""
    terms = []
    for metadata_provider in get_video_services():
        terms.append(
            SimpleTerm(
                value=metadata_provider.id,
                token=metadata_provider.id,
                title=metadata_provider.name,
            )
        )
    return SimpleVocabulary(terms)
