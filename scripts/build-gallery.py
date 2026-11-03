#!/usr/bin/env python3
"""Build gallery.json from the images in gallery/.

Title defaults to the file name ("morning-dew.jpg" -> "Morning Dew").
To set a title/subtitle/description, add gallery/info.json:
  { "morning-dew.jpg": { "title": "...", "subtitle": "...", "desc": "..." } }
"""
import json, os, re, sys
from urllib.parse import quote

# magic bytes: jpg, png, gif, webp, svg/xml, avif
MAGIC = (b'\xff\xd8\xff', b'\x89PNG', b'GIF8', b'RIFF', b'<svg', b'<?xml', b'\x00\x00\x00')

EXT = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'}
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
info = {}
if os.path.exists('gallery/info.json'):
    info = json.load(open('gallery/info.json'))
files = sorted((f for f in os.listdir('gallery') if os.path.splitext(f)[1].lower() in EXT),
               key=lambda f: -os.path.getmtime(os.path.join('gallery', f)))
out = []
for f in files:
    path = os.path.join('gallery', f)
    with open(path, 'rb') as fh:
        head = fh.read(12)
    if os.path.getsize(path) < 100 or not head.startswith(MAGIC):
        print(f'SKIPPED {f}: not a valid image (empty or corrupt upload)', file=sys.stderr)
        continue
    meta = info.get(f, {})
    base = re.sub(r'[\s_-]*edited$', '', os.path.splitext(f)[0], flags=re.I)
    name = re.sub(r'[-_]+', ' ', base).strip().title()
    out.append({'src': 'gallery/' + quote(f), 'title': meta.get('title', name),
                'subtitle': meta.get('subtitle', ''), 'category': meta.get('category', ''),
                'desc': meta.get('desc', '')})
json.dump(out, open('gallery.json', 'w'), indent=2)
print(f'{len(out)} photos')
