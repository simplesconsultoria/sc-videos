"""Vocabulary for series filtering."""

from plone.app.vocabularies.catalog import StaticCatalogVocabulary
from Products.CMFCore.PortalContent import PortalContent
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory


@provider(IVocabularyFactory)
def series_catalog_vocabulary(context: PortalContent | None) -> StaticCatalogVocabulary:
    """Return a vocabulary for series filtering."""
    return StaticCatalogVocabulary({
        "portal_type": ["VideoSeries"],
        "sort_on": "sortable_title",
    })
