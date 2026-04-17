from plone.app.querystring.interfaces import IParsedQueryIndexModifier
from sc.videos.vocabularies.duration_ranges import DURATION_RANGE_TERMS
from typing import TypedDict
from zope.interface import implementer


class DurationValue(TypedDict):
    query: str


class DurationQuery(TypedDict):
    query: int | tuple[int, int]
    range: str


def build_query(min_value: int, max_value: int | None) -> DurationQuery:
    """Build a query dict for a given duration range.

    :param min_value: Minimum duration in seconds.
    :param max_value: Maximum duration in seconds, or None for no upper limit.
    :returns: A query dict with 'query' and 'range' keys.
    """
    if max_value is None:
        return {"query": min_value, "range": "min"}
    return {"query": (min_value, max_value), "range": "min:max"}


@implementer(IParsedQueryIndexModifier)
class duration_modifier:
    def __call__(self, value: DurationValue) -> tuple[str, DurationQuery]:
        key: str = value["query"]
        for term_value, _, min_duration, max_duration in DURATION_RANGE_TERMS:
            if term_value != key:
                continue
            query = build_query(min_duration, max_duration)
            return ("duration", query)
        return ("duration", {"query": 0, "range": "min"})
