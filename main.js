/*import Game from './classes/Game.js';
import { preloadImages } from './utils.js';
import { TILE_IMAGES, loadTowerImages, ENEMY_IMAGES, BULLET_IMAGES, TILE_SIZE } from './config.js';


const canvas = document.getElementById('game-canvas');
canvas.width = 852;
canvas.height = 393;
const ctx = canvas.getContext('2d');



(async () => {
  const [tileImages, towerImages, enemyImages, bulletImages] = await Promise.all([
    preloadImages(TILE_IMAGES),
    loadTowerImages(),
    preloadImages(ENEMY_IMAGES),
    preloadImages(BULLET_IMAGES),
  ]);

  const game = new Game(ctx, canvas.width, canvas.height, {
    tileImages,
    towerImages,
    enemyImages,
    bulletImages
  });

  await game.init();
  game.start();
})();
*/

import { preloadImages } from './utils.js';
import { TILE_IMAGES, ENEMY_IMAGES, BULLET_IMAGES, loadTowerImages } from './config.js';
import { setTileSize } from './config.js';

import Game from './classes/Game.js';

const canvas = document.getElementById('game-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mapCols = 26;
const mapRows = 11;

const dynamicTileSize = Math.floor(Math.min(
  canvas.width / mapCols,
  canvas.height / mapRows
));

setTileSize(dynamicTileSize);

const LOCAL_VERSION_KEY = 'pwa_version';
async function checkAppVersion() {
  try {
    const res = await fetch('/manifest.json', { cache: 'no-cache' });
    const manifest = await res.json();
    const newVersion = manifest.version;
    const currentVersion = localStorage.getItem(LOCAL_VERSION_KEY);

    if (currentVersion && newVersion !== currentVersion) {
      console.log(`Update detected: ${currentVersion} → ${newVersion}`);
      localStorage.setItem(LOCAL_VERSION_KEY, newVersion);
      // Reload with network freshness
      location.reload(true); 
    } else if (!currentVersion) {
      localStorage.setItem(LOCAL_VERSION_KEY, newVersion);
    }
  } catch (err) {
    console.warn('Manifest version check failed:', err);
  }
}

checkAppVersion();


(async () => {
  const [tileImages, towerImages, enemyImages, bulletImages] = await Promise.all([
    preloadImages(TILE_IMAGES),
    loadTowerImages(),
    preloadImages(ENEMY_IMAGES),
    preloadImages(BULLET_IMAGES),
  ]);

  const game = new Game(canvas.getContext('2d'), canvas.width, canvas.height, {
    tileImages,
    towerImages,
    enemyImages,
    bulletImages,
  });

  await game.init();
  game.start();
})();
