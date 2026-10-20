"""Bundle the game into one offline HTML, with no external resources."""
from pathlib import Path
import base64
import html
import mimetypes
import re

ROOT = Path(__file__).resolve().parent
DIST = ROOT / 'dist'
OUT = ROOT / '未完成的图鉴_离线版.html'
source = (DIST / 'index.html').read_text()
images = {}

def embed_url(match):
    value = match.group(1).strip(' \'"')
    if value.startswith('data:'):
        return match.group(0)
    path = (DIST / value).resolve()
    if not path.is_relative_to(DIST):
        raise ValueError(f'Unexpected asset: {value}')
    data = base64.b64encode(path.read_bytes()).decode('ascii')
    mime = 'font/woff2' if path.suffix == '.woff2' else mimetypes.guess_type(path.name)[0]
    url = f'url("data:{mime};base64,{data}")'
    if path.suffix == '.woff2':
        return url
    if value not in images:
        images[value] = (f'--offline-image-{len(images)}', url)
    # Embed directly: browsers cap CSS variable expansion for large data URLs.
    return url

styles = '\n'.join((DIST / name).read_text() for name in ['style.css', 'pixel-ui.css'])
styles = re.sub(r'url\(([^)]+)\)', embed_url, styles)
asset_style = ''
source = re.sub(r'\s*<link rel="stylesheet" href="[^"]+">', '', source)
source = source.replace('</head>', '<style>\n' + asset_style + styles + '\n</style>\n</head>')
script = (DIST / 'game.js').read_text().replace('</script', '<\\/script')
source = source.replace('<script src="game.js" defer></script>', '<script>\n' + script + '\n</script>')
license_text = (DIST / 'assets/fonts/LICENSE-OFL').read_text()
source = source.replace('</body>', '<template id="font-license">' + html.escape(license_text) + '</template>\n</body>')
source = source.replace('<title>未完成的图鉴 · 档案桌</title>', '<title>未完成的图鉴 · 离线版</title>')
source = source.replace('<meta charset="UTF-8">', '''<meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; media-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'">
  <meta name="offline-build" content="All game code, images, fonts, and font license are embedded in this HTML.">''')
assert not re.search(r'<(?:script|link|img)[^>]+(?:src|href)=[\'"](?!data:)', source)
assert not re.search(r'url\([\'"]?(?:assets/|https?://)', source)
OUT.write_text(source)
print(f'Output: {OUT}\nSize: {OUT.stat().st_size / 1024 / 1024:.2f} MB\nEmbedded images: {len(images)}\nEmbedded font and license: yes\nExternal resource dependencies: 0')
