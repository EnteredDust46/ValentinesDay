# Valentine's Day Website 💕

A cute single-page site with a Valentine's intro and a photo section that animates your pics.

## Quick start

1. **Add your photos** into the `images` folder (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`).
2. **Build the image list** (run once after adding/changing images):
   ```bash
   node build-image-list.js
   ```
3. **Open the site** with a local server (needed so `images-list.json` loads):
   ```bash
   npx serve .
   ```
   Then open the URL it prints (e.g. http://localhost:3000).

To open the HTML file directly in the browser, use a simple server like above; otherwise the fetch for `images-list.json` may not work.

## What’s included

- **Intro**: “Happy Valentine’s Day” with a short pop-in animation and floating hearts.
- **Photo section**: Click “See our pics” to load and show all images from `images` with a staggered “throw-in” animation.

Enjoy.
