# Data Science App Gallery

A minimal static gallery to showcase student-built web apps by topic. Left sidebar lists topics and apps; the selected app loads in an iframe on the right.

## Quick start

Use any static file server at the repository root.

- Python 3

```bash
python3 -m http.server 8080
```

- Node.js

```bash
npx serve -l 8080
```

Then open:

```
http://localhost:8080/
```

Note: Some external sites block embedding in iframes (via X-Frame-Options or CSP). If an app won’t render, click "Open in new tab".

## Data format (URLs only)

Edit `data/gallery.json` to list only URLs per topic:

```json
{
  "topics": [
    {
      "title": "Linear Algebra",
      "apps": [
  "https://example.edu/student-a/eigenvectors/",
  "./apps/la/svd/index.html"
      ]
    }
  ]
}
```

- Display names are inferred from the URL (last path segment, else hostname). Hash fragments are ignored.
- Search indexes topic title, inferred app title, and URL.

If you prefer richer metadata (title/author/description), you can still use the old shape with objects; the gallery remains backward-compatible.

## Customization

- Title and styles: tweak `index.html` and `styles.css`.
- Mobile: sidebar collapses; use the ☰ button.

## Folder layout

- `index.html` – gallery shell
- `styles.css` – layout and theming
- `script.js` – loads `data/gallery.json`, builds menu, controls iframe
- `data/gallery.json` – your topics and apps (URLs only or objects)
- `apps/` – optional local demo/student apps (sample included)

## Teaching tips

- Ask students to host on GitHub Pages for easy embedding and stable URLs.
- Keep URLs clean and stable; the gallery infers names from the last path segment.
- External apps may disallow embedding; rely on the new-tab link when needed.