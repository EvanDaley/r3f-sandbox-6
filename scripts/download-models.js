/**
 * Script to help download models from the character-control demo
 * 
 * To use:
 * 1. Open https://character-control.vercel.app/ in your browser
 * 2. Open DevTools > Network tab
 * 3. Filter by "glb" or "gltf"
 * 4. Look for model files being loaded
 * 5. Right-click and "Copy link address"
 * 6. Use wget or curl to download:
 *    wget <url> -O public/models/uncle-pete.glb
 * 
 * Alternative: Check the ecctrl GitHub repo for example models
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Common model paths to try
const possiblePaths = [
  '/models/uncle-pete.glb',
  '/uncle-pete.glb',
  '/assets/uncle-pete.glb',
  '/character.glb',
  '/models/character.glb',
];

const baseUrl = 'https://character-control.vercel.app';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${dest}`);
          resolve();
        });
      } else {
        fs.unlink(dest, () => {});
        reject(new Error(`Failed: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function tryDownloadModels() {
  const modelsDir = path.join(__dirname, '../public/models');
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  console.log('Attempting to download models...');
  console.log('Note: These paths may not exist. Check the network tab in browser DevTools for actual paths.');
  
  for (const modelPath of possiblePaths) {
    const url = baseUrl + modelPath;
    const filename = path.basename(modelPath);
    const dest = path.join(modelsDir, filename);
    
    try {
      await downloadFile(url, dest);
      console.log(`✓ Successfully downloaded ${filename}`);
    } catch (err) {
      console.log(`✗ Failed to download ${url}: ${err.message}`);
    }
  }
}

// Uncomment to run:
// tryDownloadModels();

console.log(`
To download models manually:
1. Open https://character-control.vercel.app/ in browser
2. Open DevTools > Network tab
3. Filter by "glb" or "gltf"
4. Find the model file and copy its URL
5. Download with: wget <url> -O public/models/uncle-pete.glb
`);
