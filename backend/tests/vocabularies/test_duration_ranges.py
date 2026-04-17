from sc.videos import PACKAGE_NAME
from zope.schema.vocabulary import SimpleVocabulary

import pytest


class TestVocab:
    name: str = f"{PACKAGE_NAME}.vocabulary.duration_ranges"

    @pytest.fixture(autouse=True)
    def _setup(self, portal, get_vocabulary):
        self.portal = portal
        self.vocab = get_vocabulary(self.name, portal)

    def test_vocabulary_type(self):
        assert isinstance(self.vocab, SimpleVocabulary)

    def test_vocabulary_length(self):
        assert len(self.vocab) == 4

    @pytest.mark.parametrize(
        "token",
        [
            "0-10",
            "11-30",
            "31-60",
            "60+",
        ],
    )
    def test_vocab_terms(self, token: str):
        term = self.vocab.getTermByToken(token)
        assert term.value == token
