/**
 * Copy static files to standalone build directory
 * Windows-compatible alternative to: cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/
 */
const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`  Skipping: ${src} (not found)`);
    return;
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying static files for standalone build...');

// Copy .next/static to .next/standalone/.next/static
const staticSrc = path.join(__dirname, '.next', 'static');
const staticDest = path.join(__dirname, '.next', 'standalone', '.next', 'static');
copyDirSync(staticSrc, staticDest);
console.log('  ✓ .next/static → .next/standalone/.next/static');

// Copy public to .next/standalone/public
const publicSrc = path.join(__dirname, 'public');
const publicDest = path.join(__dirname, '.next', 'standalone', 'public');
copyDirSync(publicSrc, publicDest);
console.log('  ✓ public → .next/standalone/public');

// Copy prisma to .next/standalone/prisma (needed for runtime)
const prismaSrc = path.join(__dirname, 'prisma');
const prismaDest = path.join(__dirname, '.next', 'standalone', 'prisma');
copyDirSync(prismaSrc, prismaDest);
console.log('  ✓ prisma → .next/standalone/prisma');

// Copy db to .next/standalone/db (SQLite database)
const dbSrc = path.join(__dirname, 'db');
const dbDest = path.join(__dirname, '.next', 'standalone', 'db');
copyDirSync(dbSrc, dbDest);
console.log('  ✓ db → .next/standalone/db');

// Copy .env to .next/standalone/.env
const envSrc = path.join(__dirname, '.env');
const envDest = path.join(__dirname, '.next', 'standalone', '.env');
if (fs.existsSync(envSrc)) {
  fs.copyFileSync(envSrc, envDest);
  console.log('  ✓ .env → .next/standalone/.env');
}

console.log('\nAll files copied successfully!');
