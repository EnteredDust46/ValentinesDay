#!/usr/bin/env node
/**
 * Run this once after adding images to the images/ folder.
 * Creates images-list.json so the website knows which photos to show.
 * Usage: node build-image-list.js
 */

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const outputPath = path.join(__dirname, 'images-list.json');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('Created images/ folder. Add your photos there and run this script again.');
  fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
  process.exit(0);
}

const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const files = fs.readdirSync(imagesDir)
  .filter(f => validExtensions.includes(path.extname(f).toLowerCase()))
  .sort();

fs.writeFileSync(outputPath, JSON.stringify(files, null, 2));
console.log(`Wrote ${files.length} image(s) to images-list.json`);
if (files.length === 0) {
  console.log('Add some .jpg, .png, .gif or .webp files to the images/ folder!');
}
