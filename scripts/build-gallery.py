#!/usr/bin/env python3
"""Build gallery.json from the images in gallery/.

Title defaults to the file name ("morning-dew.jpg" -> "Morning Dew").
To set a title/subtitle/description, add gallery/info.json:
  { "morning-dew.jpg": { "title": "...", "subtitle": "...", "desc": "..." } }
"""
import json, os, re

EXT = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'}
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
info = {}
if os.path.exists('gallery/info.json'):
    info = json.load(open('gallery/info.json'))
files = sorted((f for f in os.listdir('gallery') if os.path.splitext(f)[1].lower() in EXT),
               key=lambda f: -os.path.getmtime(os.path.join('gallery', f)))
out = []
for f in files:
    meta = info.get(f, {})
    name = re.sub(r'[-_]+', ' ', os.path.splitext(f)[0]).strip().title()
    out.append({'src': 'gallery/' + f, 'title': meta.get('title', name),
                'subtitle': meta.get('subtitle', ''), 'category': meta.get('category', ''),
                'desc': meta.get('desc', '')})
json.dump(out, open('gallery.json', 'w'), indent=2)
print(f'{len(out)} photos')
