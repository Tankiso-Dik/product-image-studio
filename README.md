# Product Image Studio

Static scenes with server-side composition and screenshot rendering.

## Regenerating outputs

This project builds temporary HTML files and PNG screenshots from scene JSON files.

1. Install dependencies:
   ```sh
   npm install
   ```
2. For a single scene:
   ```sh
   npm run load scenes/<scene>.json
   node scripts/render.js output/<scene>.temp.html output/<scene>.png
   ```
3. Render all scenes in batch:
   ```sh
   npm run batch
   ```

The commands above write `.temp.html` files and corresponding `.png` images into `output/`, which is ignored in version control.

## API

### `POST /api/screenshot`

Generate a PNG from any scene. The request body mirrors the fields used by `/api/compose` and also accepts `width` and `height`:

```sh
curl -o out.png -X POST http://localhost:3000/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"scene":"01-thumbnail","width":1600,"height":900}'
```

The response has `Content-Type: image/png` and returns the raw image bytes.

