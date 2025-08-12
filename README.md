1) README.md — final merged content (paste this over the conflicted file)
md
Copy
Edit
# Product Image Studio

Static scenes with server-side composition and screenshot rendering.

## Regenerating outputs

This project builds temporary HTML files and PNG screenshots from scene JSON files.

1. Install dependencies:
   ```sh
   npm install
For a single scene:

sh
Copy
Edit
npm run load scenes/<scene>.json
node scripts/render.js output/<scene>.temp.html output/<scene>.png
Render all scenes in batch:

sh
Copy
Edit
npm run batch
The commands above write .temp.html files and corresponding .png images into output/, which is ignored in version control.

API
POST /api/screenshot
Generate a PNG from any scene. The request body mirrors the fields used by /api/compose and also accepts width and height:

sh
Copy
Edit
curl -o out.png -X POST http://localhost:3000/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"scene":"01-thumbnail","width":1600,"height":900}'
The response has Content-Type: image/png and returns the raw image bytes.

License
Licensed under the MIT License.

sql
Copy
Edit

Then:
```bash
git add README.md
git commit -m "docs: merge README with /api/screenshot docs + keep License"
2) Fix /api/screenshot failing with libatk-1.0.so.0 missing
That’s just Chromium’s native deps not installed on your Kubuntu box. Install the usual headless set:

bash
Copy
Edit
sudo apt-get update && sudo apt-get install -y \
  libatk1.0-0 libatk-bridge2.0-0 libatspi2.0-0 \
  libnss3 libxss1 libx11-6 libx11-xcb1 libxcb1 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
  libxkbcommon0 libgbm1 libdrm2 libxshmfence1 \
  libgtk-3-0 libcups2 libasound2 \
  libpango-1.0-0 libpangocairo-1.0-0 libcairo2 \
  fonts-liberation
Then ensure Puppeteer’s Chromium is present (usually installed at npm install, but just in case):

bash
Copy
Edit
npx puppeteer browsers install chromium
Restart the server and test:

bash
Copy
Edit
npm start
# new terminal:
curl -o out.png -X POST http://localhost:3000/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"scene":"01-thumbnail","width":1600,"height":900,"browserScreenshot":"/assets/screenshots/placeholder.png"}'
xdg-open out.png
If you’re still on Wayland and it’s grumpy
You can add a couple flags (we already run --no-sandbox & --disable-setuid-sandbox). If needed, you can also try --disable-gpu:

js
Copy
Edit
// server.js -> puppeteer.launch(...)
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});
