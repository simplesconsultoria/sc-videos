---
myst:
  html_meta:
    "description": "How to contribute to sc-videos — development setup, testing, pull requests"
    "property=og:description": "How to contribute to sc-videos — development setup, testing, pull requests"
    "property=og:title": "🤝 Contribute to sc-videos"
    "keywords": "Plone, contribute, development, testing, sc-videos"
---

# 🤝 Contribute to sc-videos

This guide covers the development workflow for contributors.

## 🔧 Development setup

### Prerequisites

- Python 3.12+
- Node.js 20+
- pnpm 10+
- Docker and Docker Compose (for the backend stack)
- `make` available on your system

### Clone and install

```console
git clone git@github.com:simplesconsultoria/sc-videos.git
cd sc-videos
make install
```

This installs both the backend and frontend dependencies.

### Start the development servers

```console
make start
```

This starts:
- The Plone backend on `http://localhost:8080`
- The Volto frontend on `http://localhost:3000`

## 🧪 Testing

### Run all tests

```console
make test
```

### Backend tests only

```console
cd backend
make test
```

The backend uses pytest.
Tests live under `backend/tests/`.

### Frontend tests only

```console
cd frontend
make test
```

The frontend uses vitest.
Tests live alongside the source code as `*.test.ts` files.

### Linting

```console
make lint
```

This runs:
- **Backend**: `ruff` (linting + formatting check)
- **Frontend**: `eslint`, `prettier`, `stylelint`

### Formatting

```console
make format
```

Applies auto-fixes for both backend and frontend.

## 📖 Storybook

Run the Storybook development server:

```console
cd frontend
make storybook-start
```

Opens on `http://localhost:6006`.

Build a static Storybook:

```console
cd frontend
make storybook-build
```

## 📝 Changelog

sc-videos uses [towncrier](https://towncrier.readthedocs.io/) for changelog management.
Both backend and frontend have their own `news/` directories.

When you make a change, create a news fragment:

```console
# For changes tracked by a GitHub issue:
echo "Added support for Dailymotion videos." > backend/news/42.feature

# For changes without an issue:
echo "Fixed metadata preview alignment." > frontend/packages/volto-videos/news/+1.bugfix
```

Fragment types: `feature`, `bugfix`, `breaking`, `internal`, `documentation`, `tests`.

:::{note}
Unnumbered fragments must be prefixed with `+` (e.g. `+1.feature`, not `1.feature`).
:::

## 🌿 Branch naming

Feature branches that address a GitHub issue must start with `issue-`:

```text
issue-42
issue-42-add-dailymotion-support
```

## 📤 Pull requests

1. Create your branch from `main`.
2. Make your changes, add tests, add a news fragment.
3. Run `make test` and `make lint` to verify.
4. Push and open a pull request against `main`.

:::{seealso}
- {doc}`/concepts/architecture` — Repository structure and component overview.
- {doc}`/how-to-guides/add-a-video-provider` — Example of a substantial contribution.
:::
