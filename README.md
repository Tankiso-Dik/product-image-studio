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

