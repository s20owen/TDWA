/*
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
const navigationSource = performance.getEntriesByType("navigation")[0]?.type;
let selectedLevel = parseInt(localStorage.getItem('selectedLevel')) || null;

// Only reset selectedLevel on full reload or direct navigation
if (navigationSource === 'reload' || navigationSource === 'navigate') {
  // Only reset if NOT already playing
  if (!sessionStorage.getItem('playing')) {
    localStorage.removeItem('selectedLevel');
    selectedLevel = null;
  }
}



// Show level select screen if no level is selected
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
      sessionStorage.setItem('playing', 'true');
      location.reload();
    });

    levelSelectContainer.appendChild(btn);
  });

  // ✅ Dev Mode button setup (moved outside loop)
  const devBtn = document.getElementById('dev-mode-btn');
  if (devBtn) {
    devBtn.onclick = () => {
      const code = prompt("Enter Dev Mode Password:");
      if (code === "darkops") {
        localStorage.setItem('DEV_MODE', 'true');
        location.reload();
      } else {
        alert("❌ Incorrect Code.");
      }
    };
  }

  canvas.style.display = 'none';
  gameWrapper.style.display = 'none';
  levelScreen.style.display = 'flex';
} else {
  startGame(selectedLevel);
}

// ✅ Game init wrapper
function startGame(selectedLevel) {
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

// ✅ Restart = return to level select
window.restartGame = function () {
  localStorage.removeItem('selectedLevel');
  location.reload(); // triggers the level select screen
  // Hide game canvas and overlays
  document.getElementById('game-canvas').style.display = 'none';
  document.getElementById('game-over-overlay').style.display = 'none';

  // Show level select screen again
  document.getElementById('level-screen').style.display = 'flex';
};*/
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

// 🔥 Always start from level select screen
canvas.style.display = 'none';
gameWrapper.style.display = 'none';
levelScreen.style.display = 'flex';

const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

// Set up level buttons
Object.entries(LEVELS).forEach(([levelId, levelData]) => {
  const btn = document.createElement('button');
  btn.className = 'level-button';
  btn.disabled = parseInt(levelId) > unlockedLevel;
  if (btn.disabled) btn.classList.add('locked');

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
    startGame(parseInt(levelId));
  });

  levelSelectContainer.appendChild(btn);
});

// Dev mode unlock
document.getElementById('dev-mode-btn').onclick = () => {
  const code = prompt("Enter Dev Mode Password:");
  if (code === "darkops") {
    localStorage.setItem('DEV_MODE', 'true');
    location.reload();
  } else {
    alert("❌ Incorrect Code.");
  }
};

// ✅ Start game from selected level
async function startGame(levelId) {
  const { map: MAP_DATA, waves: WAVES } = LEVELS[levelId];

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
    selectedLevel: levelId,
  });

  await game.init();
  game.start();

  levelScreen.style.display = 'none';
  gameWrapper.style.display = 'block';
  canvas.style.display = 'block';
}

// 🔁 Restart button logic
window.restartGame = function () {
  // Go back to level select
  document.getElementById('game-canvas').style.display = 'none';
  document.getElementById('game-over-overlay').style.display = 'none';
  document.getElementById('game-wrapper').style.display = 'none';
  document.getElementById('level-screen').style.display = 'flex';
};
