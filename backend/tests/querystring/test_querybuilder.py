"""Integration tests for querystring fields with the querybuilder."""

from zope.component import getMultiAdapter
from zope.publisher.browser import TestRequest

import pytest


@pytest.fixture(scope="class")
def document(content_factory, portal):
    return content_factory(
        portal,
        {
            "type": "Document",
            "id": "a-document",
            "title": "A Document",
        },
    )


class TestQueryBuilder:
    """Test querying by duration and has_video using the querybuilder."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, videos, document):
        self.portal = portal
        request = TestRequest()
        self.querybuilder = getMultiAdapter(
            (portal, request), name="querybuilderresults"
        )

    @pytest.mark.parametrize(
        "operation,value,expected,not_expected",
        [
            (
                "plone.app.querystring.operation.int.is",
                "300",
                ["Short Video"],
                ["Medium Video", "Long Video", "Very Long Video"],
            ),
            (
                "plone.app.querystring.operation.int.lessThan",
                "1000",
                ["Short Video", "Medium Video"],
                ["Long Video", "Very Long Video"],
            ),
            (
                "plone.app.querystring.operation.int.largerThan",
                "3000",
                ["Very Long Video"],
                ["Short Video", "Medium Video", "Long Video"],
            ),
        ],
    )
    def test_duration(self, operation, value, expected, not_expected):
        query = [{"i": "duration", "o": operation, "v": value}]
        results = self.querybuilder(query=query)
        titles = [r.Title() for r in results]
        for title in expected:
            assert title in titles
        for title in not_expected:
            assert title not in titles

    @pytest.mark.parametrize(
        "operation,expected,not_expected",
        [
            (
                "plone.app.querystring.operation.boolean.isTrue",
                ["Short Video"],
                ["A Document"],
            ),
            (
                "plone.app.querystring.operation.boolean.isFalse",
                ["A Document"],
                ["Short Video"],
            ),
        ],
    )
    def test_has_video(self, operation, expected, not_expected):
        query = [{"i": "has_video", "o": operation, "v": ""}]
        results = self.querybuilder(query=query)
        titles = [r.Title() for r in results]
        for title in expected:
            assert title in titles
        for title in not_expected:
            assert title not in titles
