#!/usr/bin/env python3
"""Snapshot the public Estatestar frontend without changing its presentation.

Source snapshots and the download manifest remain in ignored research/.
Run from the repository root. The GitHub Pages project prefix is intentional.
"""
import base64
import concurrent.futures
import html
import json
import posixpath
import re
import shutil
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://estatestar.de'
PREFIX = '/estatestar-preview/'
CACHE = ROOT / 'research/original-mirror'
CACHE.mkdir(parents=True, exist_ok=True)
PAGES = ['', 'en', 'luftaufnahmen', 'exterieur', 'interieur', 'nachtaufnahmen',
         'aerials', 'exterior', 'interior', 'night', 'impressum', 'datenschutz',
         'imprint', 'dataprotection']
EXTENSIONS = {'.css', '.js', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg',
              '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm', '.json', '.ico'}
URL_RE = re.compile(r'(?:https?:)?//estatestar\.de/[^\s<>"\x27\\(){}]+')
known = {}
errors = {}
video_map = {v['url']: PREFIX + v['path'] for v in json.loads((ROOT / 'research/video-downloads.json').read_text())}

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; Estatestar-preview)'})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read()

def normalized(url):
    parts = urllib.parse.urlsplit(url.replace('http://', 'https://') if not url.startswith('//') else 'https:' + url)
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, posixpath.normpath(parts.path), '', ''))

def asset_urls(text, base=ORIGIN + '/'):
    text = html.unescape(text.replace('\\/', '/'))
    found = {normalized(u) for u in URL_RE.findall(text)}
    for match in re.finditer(r'url\(\s*[\x27"]?([^\x27"\s)]+)', text):
        url = urllib.parse.urljoin(base, match.group(1))
        if urllib.parse.urlsplit(url).hostname == 'estatestar.de':
            found.add(normalized(url))
    for match in re.finditer(r'data-gallery-items=[\x27"]([A-Za-z0-9+/=]+)', text):
        try:
            found.update(asset_urls(base64.b64decode(match.group(1)).decode()))
        except (ValueError, UnicodeDecodeError):
            pass
    return {u for u in found if Path(urllib.parse.urlsplit(u).path).suffix.lower() in EXTENSIONS}

def download(url):
    if url in video_map:
        return url, video_map[url], ''
    path = urllib.parse.unquote(urllib.parse.urlsplit(url).path).lstrip('/')
    if '..' in Path(path).parts:
        return url, '', 'Unsafe relative path'
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    try:
        if not target.exists():
            original = ROOT / 'research/originale-und-pruefung' / target.name
            if original.is_file() and target.suffix.lower() not in ('.css', '.js', '.json'):
                shutil.copyfile(original, target)
            else:
                target.write_bytes(fetch(url))
        return url, PREFIX + path, ''
    except Exception as error:
        return url, '', str(error)

def replace_urls(text):
    # Preserve JSON slash escaping where the original used it.
    for source, target in sorted(known.items(), key=lambda item: -len(item[0])):
        text = text.replace(source, target)
        text = text.replace(source.replace('/', '\\/'), target.replace('/', '\\/'))
        text = text.replace(source.removeprefix('https:'), target)
    for page in sorted(PAGES, key=len, reverse=True):
        source = ORIGIN + ('/' + page if page else '')
        target = PREFIX + (page + '/' if page else '')
        # Only exact page links, not prefixes of asset paths or API URLs.
        text = re.sub(re.escape(source) + r'/?(?=[#\x27"<\s]|&quot;|$)', lambda _: target, text)
    def gallery(match):
        try:
            decoded = base64.b64decode(match.group(2)).decode()
            return match.group(1) + base64.b64encode(replace_urls(decoded).encode()).decode() + match.group(3)
        except (ValueError, UnicodeDecodeError):
            return match.group(0)
    return re.sub(r'(data-gallery-items=[\x27"])([A-Za-z0-9+/=]+)([\x27"])', gallery, text)

def main():
    sources = {}
    for page in PAGES:
        snapshot = CACHE / ((page or 'home') + '.html')
        if not snapshot.exists():
            snapshot.write_bytes(fetch(ORIGIN + '/' + page))
        sources[page] = snapshot.read_text()
    pending = set().union(*(asset_urls(s) for s in sources.values()))
    # Elementor loads these public bundles after the initial HTML response.
    elementor_assets = ORIGIN + '/wp-content/plugins/elementor/assets/'
    frontend = ROOT / 'wp-content/plugins/elementor/assets/js/frontend.min.js'
    if frontend.exists():
        pending.update(elementor_assets + 'js/chunks/' + name + '.min.js'
                       for name in re.findall(r'__elementorLoadChunk\(`([^`]+)`\)', frontend.read_text()))
        pending.update(elementor_assets + path for path in [
            'lib/dialog/dialog.min.js', 'lib/share-link/share-link.min.js',
            'lib/swiper/v8/swiper.min.js', 'lib/swiper/v8/css/swiper.min.css',
            'css/conditionals/dialog.min.css', 'css/conditionals/lightbox.min.css'])
        pending.add(ORIGIN + '/wp-content/uploads/elementor/css/custom-lightbox.min.css')
    print(f'{len(sources)} original pages; {len(pending)} directly referenced assets', flush=True)
    while pending:
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
            results = list(pool.map(download, sorted(pending)))
        next_batch = set()
        for url, target, error in results:
            if error:
                errors[url] = error
                continue
            known[url] = target
            if Path(urllib.parse.urlsplit(url).path).suffix == '.css':
                path = ROOT / target.removeprefix(PREFIX)
                # Save unmodified CSS so reruns remain deterministic.
                original = CACHE / ('css-' + path.name)
                if not original.exists():
                    original.write_bytes(path.read_bytes())
                next_batch.update(asset_urls(original.read_text(), url))
        pending = next_batch - known.keys() - errors.keys()
        print(f'{len(known)} mirrored assets; {len(pending)} additional dependencies; {len(errors)} unavailable', flush=True)
    for source, target in known.items():
        path = ROOT / target.removeprefix(PREFIX)
        if path.suffix == '.css':
            raw = (CACHE / ('css-' + path.name)).read_text()
            # Resolve relative font/image references from combined CSS.
            def css_url(match):
                absolute = normalized(urllib.parse.urljoin(source, match.group(1)))
                return 'url("' + known.get(absolute, match.group(1)) + '")'
            raw = re.sub(r'url\(\s*[\x27"]?([^\x27"\s)]+)[\x27"]?\s*\)', css_url, raw)
            path.write_text(replace_urls(raw))
    for page, original in sources.items():
        result = replace_urls(original)
        for directory in ['/wp-content/plugins/elementor/assets/', '/wp-content/plugins/elementor-pro/assets/', '/wp-content/uploads']:
            source = ORIGIN + directory
            destination = PREFIX.rstrip('/') + directory
            result = result.replace(source, destination).replace(source.replace('/', '\\/'), destination.replace('/', '\\/'))
        result = re.sub(r'<meta\b[^>]*name=[\x27"]robots[\x27"][^>]*>', '', result, flags=re.I)
        result = result.replace('</head>', '<meta name="robots" content="noindex, nofollow">\n<script src="' + PREFIX + 'preview-guard.js"></script>\n</head>', 1)
        # An unused public third-party key is unnecessary in a static preview.
        result = re.sub(r'var PaBehanceSettings = \{[^;]+;', 'var PaBehanceSettings = {};', result)
        target = ROOT / page / 'index.html' if page else ROOT / 'index.html'
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(result)
    (CACHE / 'manifest.json').write_text(json.dumps({'assets': known, 'unavailable': errors}, indent=2, ensure_ascii=False))
    print(json.dumps({'pages': len(sources), 'assets': len(known), 'unavailable': errors}, indent=2), flush=True)

if __name__ == '__main__':
    main()
