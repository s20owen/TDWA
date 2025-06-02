
/*import { preloadImages } from './utils.js';
import { TILE_IMAGES, ENEMY_IMAGES, BULLET_IMAGES, loadTowerImages, LEVELS } from './config.js';
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
  
})();*/
import { preloadImages } from './utils.js';
import { TILE_IMAGES, ENEMY_IMAGES, BULLET_IMAGES, loadTowerImages, LEVELS } from './config.js';
import Game from './classes/Game.js';

const canvas = document.getElementById('game-canvas');
canvas.width = 852;
canvas.height = 393;
const ctx = canvas.getContext('2d');

const levelScreen = document.getElementById('level-screen');
const gameWrapper = document.getElementById('game-wrapper');
const levelSelectContainer = document.getElementById('level-select');

const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
let selectedLevel = parseInt(localStorage.getItem('selectedLevel')) || null;

if (!selectedLevel) {
  Object.entries(LEVELS).forEach(([levelId, levelData]) => {
    const btn = document.createElement('button');
    btn.className = 'level-button';
    btn.disabled = parseInt(levelId) > unlockedLevel;
    if (btn.disabled) btn.classList.add('locked');

    // Add preview image
    if (levelData.preview) {
      const img = document.createElement('img');
      img.src = levelData.preview;
      img.alt = `Level ${levelId}`;
      img.style.width = '100%';
      img.style.borderRadius = '6px';
      img.style.marginBottom = '8px';
      btn.appendChild(img);
    }

    const label = document.createElement('div');
    label.textContent = `Level ${levelId}`;
    label.style.fontWeight = 'bold';
    label.style.color = '#1e1e2f';
    btn.appendChild(label);

    btn.addEventListener('click', () => {
      localStorage.setItem('selectedLevel', levelId);
      location.reload();
    });

    levelSelectContainer.appendChild(btn);
  });

  canvas.style.display = 'none';
  gameWrapper.style.display = 'none';
  levelScreen.style.display = 'flex';
} else {
  const { map: MAP_DATA, waves: WAVES } = LEVELS[selectedLevel];

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
      bulletImages,
      MAP_DATA,
      WAVES,
      selectedLevel,
    });

    await game.init();
    game.start();

    levelScreen.style.display = 'none';
    gameWrapper.style.display = 'block';
  })();
}

// restart the game function
window.restartGame = function () {
  localStorage.removeItem('selectedLevel');

  // Hide game canvas and overlays
  document.getElementById('game-canvas').style.display = 'none';
  document.getElementById('game-over-overlay').style.display = 'none';

  // Show level select screen again
  document.getElementById('level-select-screen').style.display = 'flex';

  // Optionally reset other state like music, HUD, etc.
};

