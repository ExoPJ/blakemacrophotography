# Blake Portfolio

Static site: `index.html`, `milestones.html`, `showcase.html`, `gallery.html`.

## Adding gallery photos
Upload images (jpg, png, webp, gif) to the `gallery/` folder on GitHub. A GitHub Action
rebuilds `gallery.json` and the photo appears in the gallery automatically (about a minute,
plus Pages redeploy). The title comes from the file name (`morning-dew.jpg` → "Morning Dew").
For a custom title and description, add `gallery/info.json`:

```json
{ "morning-dew.jpg": { "title": "Morning Dew", "subtitle": "Macro", "desc": "Shot at 100mm…" } }
```
