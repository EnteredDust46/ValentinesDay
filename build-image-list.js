#!/usr/bin/env node
/**
 * Run after adding photos/videos to the Images/ folder.
 * Creates images-list.json so the website knows which files to show.
 * Usage: node build-image-list.js
 */

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'Images');
const outputPath = path.join(__dirname, 'images-list.json');

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VIDEO_EXT = ['.mov', '.mp4', '.webm'];
const VALID_EXT = [...IMAGE_EXT, ...VIDEO_EXT];

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('Created Images/ folder. Add your photos and videos there, then run this script again.');
  fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
  process.exit(0);
}

const raw = fs.readdirSync(imagesDir);
const files = raw
  .filter(f => VALID_EXT.includes(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

fs.writeFileSync(outputPath, JSON.stringify(files, null, 2));
const imgCount = files.filter(f => IMAGE_EXT.includes(path.extname(f).toLowerCase())).length;
const vidCount = files.filter(f => VIDEO_EXT.includes(path.extname(f).toLowerCase())).length;
console.log(`Wrote ${files.length} file(s) to images-list.json (${imgCount} images, ${vidCount} videos).`);
if (files.length === 0) {
  console.log('Add .jpg, .jpeg, .png, .gif, .webp, .mov, or .mp4 files to the Images/ folder!');
}
