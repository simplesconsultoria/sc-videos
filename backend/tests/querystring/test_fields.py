"""Test that querystring field definitions are registered in the registry."""

import pytest


DURATION_FIELD = "plone.app.querystring.field.duration"
DURATION_RANGE_FIELD = "plone.app.querystring.field.duration_range"
HAS_VIDEO_FIELD = "plone.app.querystring.field.has_video"


class TestQuerystringFields:
    @pytest.fixture(autouse=True)
    def _setup(self, registry):
        self.registry = registry

    @pytest.mark.parametrize(
        "prefix,expected",
        [
            (DURATION_FIELD, "Video duration"),
            (DURATION_RANGE_FIELD, "Video duration range"),
            (HAS_VIDEO_FIELD, "Has video"),
        ],
    )
    def test_title(self, prefix, expected):
        assert self.registry[f"{prefix}.title"] == expected

    @pytest.mark.parametrize(
        "prefix",
        [DURATION_FIELD, DURATION_RANGE_FIELD, HAS_VIDEO_FIELD],
    )
    def test_enabled(self, prefix):
        assert self.registry[f"{prefix}.enabled"] is True

    @pytest.mark.parametrize(
        "prefix,expected",
        [
            (DURATION_FIELD, True),
            (DURATION_RANGE_FIELD, False),
            (HAS_VIDEO_FIELD, False),
        ],
    )
    def test_sortable(self, prefix, expected):
        assert self.registry[f"{prefix}.sortable"] is expected

    @pytest.mark.parametrize(
        "prefix",
        [DURATION_FIELD, DURATION_RANGE_FIELD, HAS_VIDEO_FIELD],
    )
    def test_group(self, prefix):
        assert self.registry[f"{prefix}.group"] == "Video"

    @pytest.mark.parametrize(
        "prefix,expected_ops",
        [
            (
                DURATION_FIELD,
                [
                    "plone.app.querystring.operation.int.is",
                    "plone.app.querystring.operation.int.lessThan",
                    "plone.app.querystring.operation.int.largerThan",
                ],
            ),
            (
                DURATION_RANGE_FIELD,
                [
                    "plone.app.querystring.operation.selection.any",
                    "plone.app.querystring.operation.selection.none",
                ],
            ),
            (
                HAS_VIDEO_FIELD,
                [
                    "plone.app.querystring.operation.boolean.isTrue",
                    "plone.app.querystring.operation.boolean.isFalse",
                ],
            ),
        ],
    )
    def test_operations(self, prefix, expected_ops):
        operations = self.registry[f"{prefix}.operations"]
        assert len(operations) == len(expected_ops)
        for op in expected_ops:
            assert op in operations

    def test_duration_range_vocabulary(self):
        assert (
            self.registry[f"{DURATION_RANGE_FIELD}.vocabulary"]
            == "sc.videos.vocabulary.duration_ranges"
        )
