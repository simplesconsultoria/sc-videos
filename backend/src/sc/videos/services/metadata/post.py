"""``@video-metadata`` POST service for fetching external video metadata."""

from plone.dexterity.content import DexterityContent
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from sc.videos.integration import fetch_metadata
from sc.videos.integration import resolve_url
from ZPublisher.HTTPRequest import WSGIRequest


class VideoMetadataPostService(Service):
    """Accept a video URL and return its metadata as JSON.

    The request body must contain ``{"videoUrl": "<url>"}``.
    """

    context: DexterityContent
    request: WSGIRequest

    def error_response(self, status_code: int, message: str) -> dict:
        """Build and return a JSON error response.

        :param status_code: HTTP status code to set on the response.
        :param message: Human-readable error description.
        :returns: ``{"error": message}`` dict.
        """
        self.request.response.setStatus(status_code)
        return {"error": message}

    def reply(self) -> dict:
        """Handle the POST request: resolve URL, fetch metadata, return JSON.

        :returns: Metadata dict on success, or an error dict on failure.
        """
        data = json_body(self.request)
        url: str = data.get("videoUrl") or ""
        video_ref = resolve_url(url)
        if not video_ref:
            return self.error_response(400, "Unsupported video URL")
        try:
            metadata = fetch_metadata(video_ref)
        except LookupError:
            return self.error_response(
                400, f"No provider available for {video_ref.service}"
            )
        except Exception:
            return self.error_response(502, "Failed to fetch video metadata")
        return {
            "service": video_ref.service,
            "video_id": metadata.video_id,
            "title": metadata.title,
            "text": metadata.description,
            "duration": metadata.duration,
            "thumbnail_url": metadata.thumbnail_url,
            "channel": metadata.channel,
            "subjects": metadata.tags,
        }
