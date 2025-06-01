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


import Game from './classes/Game.js';

const canvas = document.getElementById('game-canvas');
canvas.width = 852;
canvas.height = 393;

const mapCols = 26;
const mapRows = 11;


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

// main.js or a global script
window.restartGame = function () {
  location.reload();
};
