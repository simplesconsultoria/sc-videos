"""Scrape a YouTube playlist and populate a Plone site with VideoSeries and Episodes.

This script must be run via zconsole::

    .venv/bin/zconsole run instance/etc/zope.conf ./scripts/scrape_playlist.py \
        <site_id> <playlist_url>

Example::

    .venv/bin/zconsole run instance/etc/zope.conf ./scripts/scrape_playlist.py \
        Plone "https://www.youtube.com/playlist?list=PLGN9BI-OAQkQJSHX6fqL565hs5NmDsj_P"
"""

from __future__ import annotations

from datetime import datetime
from datetime import UTC
from plone import api
from uuid import uuid4

import json
import subprocess
import sys
import transaction


# -- Scraping ----------------------------------------------------------------


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


# -- Default blocks ----------------------------------------------------------

VIDEOSERIES_BLOCKS = [
    {"@type": "title"},
    {"@type": "description"},
    {
        "@type": "listing",
        "headlineTag": "h2",
        "querystring": {
            "query": [
                {
                    "i": "portal_type",
                    "o": "plone.app.querystring.operation.selection.any",
                    "v": ["Episode"],
                },
                {
                    "i": "path",
                    "o": "plone.app.querystring.operation.string.relativePath",
                    "v": "./",
                },
            ],
            "sort_on": "start",
            "sort_order": "descending",
            "sort_order_boolean": True,
        },
        "styles": {},
        "theme": "grey",
        "variation": "grid",
    },
    {"@type": "slate"},
]

EPISODE_BLOCKS = [
    {"@type": "title"},
    {"@type": "description"},
    {
        "@type": "playerBlock",
        "autoPlay": False,
        "size": "l",
        "theme": "grey",
        "align": "wider",
    },
    {"@type": "slate"},
]


def apply_default_blocks(content, block_defs: list[dict]) -> None:
    """Set default blocks and blocks_layout on a content object.

    :param content: Dexterity content object with volto.blocks behavior.
    :param block_defs: List of block definition dicts.
    """
    blocks = {}
    layout_items = []
    for block_def in block_defs:
        uid = str(uuid4())
        blocks[uid] = block_def
        layout_items.append(uid)
    content.blocks = blocks
    content.blocks_layout = {"items": layout_items}


# -- Plone integration -------------------------------------------------------


def setup_site(site_id: str):
    """Set up the Plone site for content creation.

    The ``app`` global is provided by zconsole with makerequest already applied.

    :param site_id: The ID of the Plone site (e.g. ``"Plone"``).
    :returns: The Plone site object.
    """
    from sc.videos.interfaces import IBrowserLayer
    from zope.component.hooks import setSite
    from zope.interface import directlyProvidedBy
    from zope.interface import directlyProvides

    app = globals()["app"]
    request = app.REQUEST

    ifaces = [IBrowserLayer, *directlyProvidedBy(request)]
    directlyProvides(request, *ifaces)

    site = app.unrestrictedTraverse(site_id)
    setSite(site)
    return site


def get_series_container(site, container_id: str = "series"):
    """Get the series container folder under the site.

    The container must be created beforehand via the Plone UI
    (zconsole doesn't have Volto's browser views for content creation).

    :param site: The Plone site object.
    :param container_id: ID of the container folder.
    :returns: The series folder.
    :raises SystemExit: If the container does not exist.
    """
    if container_id not in site:
        print(
            f"  [error] Container '{container_id}' not found in site. "
            f"Create it via the Plone UI first.",
            file=sys.stderr,
        )
        sys.exit(1)

    container = site[container_id]
    return container


def create_series(container, playlist_data: dict):
    """Create a VideoSeries inside the container.

    :param container: The parent folder (e.g. ``site/series``).
    :param playlist_data: Scraped playlist metadata dict.
    :returns: The VideoSeries content object.
    """
    title = playlist_data["playlist_title"]
    series_id = title.lower().replace(" ", "-")

    if series_id in container:
        print(f"  [skip] VideoSeries '{title}' already exists")
        return container[series_id]

    video_series = api.content.create(
        container=container,
        type="VideoSeries",
        id=series_id,
        title=title,
        description=playlist_data.get("playlist_description", ""),
    )
    apply_default_blocks(video_series, VIDEOSERIES_BLOCKS)
    print(f"  [created] VideoSeries '{title}'")
    api.content.transition(video_series, "publish")
    return video_series


def create_episodes(video_series, videos: list[dict]) -> None:
    """Create Episode content for each video in the list.

    :param video_series: The VideoSeries container.
    :param videos: List of video dicts with title, url, and date.
    """
    from sc.videos.utils import metadata_for_content

    for video in videos:
        title = video["title"]
        video_url = video["url"]

        # Check if an Episode with this URL already exists
        existing = [
            obj
            for obj in video_series.objectValues()
            if getattr(obj, "videoUrl", None) == video_url
        ]
        if existing:
            print(f"  [skip] Episode '{title}' (URL already exists)")
            continue

        episode = api.content.create(
            container=video_series,
            type="Episode",
            title=title,
            videoUrl=video_url,
        )
        apply_default_blocks(episode, EPISODE_BLOCKS)
        metadata_for_content(episode)
        date_str = video.get("date", "")
        if date_str:
            episode.start = datetime.fromisoformat(date_str)
        api.content.transition(episode, "publish")
        print(f"  [created] Episode '{title}'")


def populate_playlist(site_id: str, url: str) -> None:
    """Scrape a playlist and populate the Plone site.

    :param site_id: The Plone site ID.
    :param url: YouTube playlist URL.
    """
    print(f"Scraping playlist: {url}")
    data = scrape_playlist(url)
    print(f"Found {data['video_count']} videos in '{data['playlist_title']}'")

    print(f"Setting up site: {site_id}")
    site = setup_site(site_id)

    print("Getting series container...")
    container = get_series_container(site)

    print("Creating VideoSeries...")
    video_series = create_series(container, data)

    print("Creating Episodes...")
    create_episodes(video_series, data["videos"])

    transaction.commit()
    print("Done.")


def _get_script_args() -> tuple[str, str]:
    """Extract script arguments from sys.argv.

    zconsole passes: [zconsole, run, zope.conf, script.py, ...script_args]
    """
    # Find the script path in sys.argv, args follow it
    script_idx = None
    for i, arg in enumerate(sys.argv):
        if arg.endswith("scrape_playlist.py"):
            script_idx = i
            break

    args = sys.argv[script_idx + 1 :] if script_idx is not None else sys.argv[1:]

    if len(args) < 2:
        print(
            "Usage: .venv/bin/zconsole run instance/etc/zope.conf "
            "./scripts/scrape_playlist.py <site_id> <playlist_url>",
            file=sys.stderr,
        )
        sys.exit(1)

    return args[0], args[1]


if __name__ == "__main__":
    site_id, url = _get_script_args()
    populate_playlist(site_id, url)
