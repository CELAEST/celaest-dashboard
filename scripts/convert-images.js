const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesDir = path.join(__dirname, '../public/images');

const convert = async (file, outFile, options) => {
  const srcPath = path.join(imagesDir, file);
  const destPath = path.join(imagesDir, outFile);
  if (!fs.existsSync(srcPath)) {
    console.warn(`File not found: ${srcPath}`);
    return;
  }
  await sharp(srcPath)
    .webp(options)
    .toFile(destPath);
  
  const srcSize = fs.statSync(srcPath).size;
  const destSize = fs.statSync(destPath).size;
  console.log(`Converted ${file} (${(srcSize / 1024).toFixed(1)} KB) to ${outFile} (${(destSize / 1024).toFixed(1)} KB) - Saved: ${((1 - destSize / srcSize) * 100).toFixed(1)}%`);
};

async function main() {
  await convert('marketplace-automation-hero-panorama-2026-06-04-v3.png', 'marketplace-automation-hero-panorama.webp', { quality: 80 });
  await convert('marketplace-automation-hero-mobile-centered.png', 'marketplace-automation-hero-mobile-centered.webp', { quality: 80 });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
