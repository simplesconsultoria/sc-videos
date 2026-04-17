"""Test the duration_range IParsedQueryIndexModifier."""

from sc.videos.querystring.duration_range import duration_modifier

import pytest


class TestDurationModifier:
    @pytest.fixture(autouse=True)
    def _setup(self):
        self.modifier = duration_modifier()

    @pytest.mark.parametrize(
        "token,expected_query",
        [
            ("0-10", {"query": (0, 600), "range": "min:max"}),
            ("11-30", {"query": (601, 1800), "range": "min:max"}),
            ("31-60", {"query": (1801, 3600), "range": "min:max"}),
            ("60+", {"query": 3601, "range": "min"}),
        ],
    )
    def test_range_to_query(self, token, expected_query):
        index, query = self.modifier({"query": token})
        assert index == "duration"
        assert query == expected_query

    def test_unknown_value_fallback(self):
        index, query = self.modifier({"query": "unknown"})
        assert index == "duration"
        assert query == {"query": 0, "range": "min"}
