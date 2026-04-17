"""Vocabulary for video duration range filtering."""

from Products.CMFCore.PortalContent import PortalContent
from sc.videos import _
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


DURATION_RANGE_TERMS = [
    ("0-10", _("0-10 minutes"), 0, 600),
    ("11-30", _("11-30 minutes"), 601, 1800),
    ("31-60", _("31-60 minutes"), 1801, 3600),
    ("60+", _("> 60 minutes"), 3601, None),
]


@provider(IVocabularyFactory)
def DurationRangesVocabulary(context: PortalContent) -> SimpleVocabulary:
    """Build a vocabulary of video duration ranges.

    :param context: The current content object (unused, required by factory).
    :returns: Vocabulary with one term per duration range.
    """
    terms = [
        SimpleTerm(value=value, token=value, title=title)
        for value, title, _, _ in DURATION_RANGE_TERMS
    ]
    return SimpleVocabulary(terms)
