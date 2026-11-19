#!/usr/bin/env python3
"""Copy the static site and set absolute sharing URLs for its deployment."""

import argparse
from html import escape
from pathlib import Path
import shutil
from urllib.parse import urlsplit


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='', help='Public site URL, including the repository path')
    args = parser.parse_args()
    base_url = args.base_url.rstrip('/') + '/' if args.base_url else ''
    if base_url:
        parsed = urlsplit(base_url)
        if parsed.scheme not in ('https', 'http') or not parsed.netloc or parsed.username or parsed.password or parsed.query or parsed.fragment:
            parser.error('--base-url must be an HTTP(S) URL without credentials, a query, or a fragment')

    root = Path(__file__).resolve().parents[1]
    output = root / '_site'
    required = ['style.css', 'main.js', 'og-image.png', 'favicon.svg']
    missing = [name for name in required if not (root / 'assets' / name).is_file()]
    if missing:
        parser.error('Missing static assets: ' + ', '.join(missing))
    source = (root / 'index.html').read_text(encoding='utf-8')
    if base_url:
        image_url = escape(base_url + 'assets/og-image.png', quote=True)
        source = source.replace('content="assets/og-image.png"', 'content="' + image_url + '"')
        page_url = escape(base_url, quote=True)
        source = source.replace('</head>', '<meta property="og:url" content="' + page_url + '">\n<link rel="canonical" href="' + page_url + '">\n</head>')
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()
    shutil.copytree(root / 'assets', output / 'assets')
    (output / 'index.html').write_text(source, encoding='utf-8')
    (output / '.nojekyll').touch()
    print('Prepared static site: ' + str(output))


if __name__ == '__main__':
    main()
