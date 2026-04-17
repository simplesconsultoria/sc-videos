"""Scrape a YouTube playlist and output its metadata as JSON.

Usage:
    uvx yt-dlp is required (installed on-the-fly via subprocess).

    python scripts/scrape_playlist.py <playlist_url>
    python scripts/scrape_playlist.py https://www.youtube.com/playlist?list=PLGN9BI-OAQkQJSHX6fqL565hs5NmDsj_P
"""

from __future__ import annotations

from datetime import datetime
from datetime import UTC

import json
import subprocess
import sys


def _format_datetime(entry: dict) -> str:
    """Return an ISO 8601 datetime from release_timestamp, timestamp, or upload_date."""
    for key in ("release_timestamp", "timestamp"):
        ts = entry.get(key)
        if ts:
            return datetime.fromtimestamp(ts, tz=UTC).isoformat()
    raw_date = entry.get("upload_date", "")
    if len(raw_date) == 8:
        return f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:8]}T00:00:00+00:00"
    return ""


def scrape_playlist(url: str) -> dict:
    """Scrape playlist metadata using yt-dlp."""
    result = subprocess.run(  # noqa: S603
        [  # noqa: S607
            "uvx",
            "yt-dlp",
            "--dump-single-json",
            "--no-download",
            "--no-warnings",
            url,
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    meta = json.loads(result.stdout)

    videos = []
    for entry in meta.get("entries", []):
        video_id = entry.get("id", "")
        if not video_id:
            continue
        videos.append({
            "title": entry.get("title", ""),
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "date": _format_datetime(entry),
        })

    return {
        "playlist_title": meta.get("title", ""),
        "playlist_description": meta.get("description", ""),
        "video_count": len(videos),
        "videos": videos,
    }


def main() -> None:
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} <playlist_url>", file=sys.stderr)
        sys.exit(1)

    url = sys.argv[1]
    data = scrape_playlist(url)
    print(json.dumps(data, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
