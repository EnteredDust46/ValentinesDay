# Valentine's Day Website 💕

A long-form Valentine's page with intro animation, a love note, and a gallery of your photos and videos (including .mov).

## Setup

1. **Add your files** into the `images` folder:
   - **Images:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
   - **Videos:** `.mov`, `.mp4`, `.webm`

2. **Build the media list** (run once after adding or changing files):
   ```bash
   node build-image-list.js
   ```
   This creates `images-list.json` so the site knows what to show.

3. **Run a local server** (required so the page can load `images-list.json`):
   ```bash
   npx serve .
   ```
   Open the URL it prints (e.g. http://localhost:3000).

## What’s on the page

- **Intro:** “Happy Valentine’s Day” with a short animation and floating hearts.  
  Button: **“See our pics & videos →”**.

- **Love note:** A short dedication (edit the text in `index.html` in the `.love-note-text` paragraph).

- **Gallery:** All images and videos from `images` with a staggered “throw-in” animation.  
  Videos play on hover (muted, looped).

- **Footer:** “Made with love · Happy Valentine’s Day”.

## Customize

- **Love note text:** In `index.html`, find the `<p class="love-note-text">` and change the text inside.
- **More media:** Add files to `images`, then run `node build-image-list.js` and refresh the page.
