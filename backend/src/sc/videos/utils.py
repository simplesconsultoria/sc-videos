from plone.namedfile import NamedBlobImage

import httpx


def image_from_url(url: str) -> NamedBlobImage:
    """Fetch image data from a URL and return as NamedBlobImage."""

    response = httpx.get(url, timeout=10.0)
    contentType = response.headers.get("Content-Type", "")
    if not contentType.startswith("image/"):
        raise ValueError(f"URL does not point to an image: {url}")

    filename = url.split("/")[-1]
    return NamedBlobImage(
        data=response.content, contentType=contentType, filename=filename
    )
