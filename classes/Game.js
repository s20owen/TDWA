import GameMap from './Map.js';
import Enemy from './Enemy.js';
import {extractPathPoints } from '../config.js';
import Tower from './Tower.js';
import { BulletPool } from './Bullet.js';
import { GAME_CONFIG, TOWER_UNLOCKS, GAME_PROGRESS_DEFAULTS, ACHIEVEMENTS, ENEMY_STATS, TOWER_COSTS, LEVELS  } from '../config.js';
import { EnemyPool } from './EnemyPool.js';
import BasicTower from './BasicTower.js';
import SniperTower from './SniperTower.js';
import SplashTower from './SplashTower.js';
import SlowTower from './SlowTower.js';
import PoisonTower from './PoisonTower.js';
import LightningTower from './LightningTower.js';
import { loadTowerImages } from '../config.js';
import { getTileSize } from '../config.js';
import { ParticlePool } from './Particle.js';

export default class Game {
  constructor(ctx, width, height, { tileImages, towerImages, enemyImages, bulletImages, MAP_DATA, WAVES, selectedLevel }) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.MAP_DATA = MAP_DATA;
    this.WAVES = WAVES;
    this.selectedLevel = selectedLevel;
    this.map = new GameMap(tileImages, this.MAP_DATA);
    
    this.achievementsAwardedThisSession = {};


    const PATH_POINTS = extractPathPoints(this.MAP_DATA);

    const GAME_PROGRESS_DEFAULTS = {
      diamonds: 0,
      unlocks: {
        basic: { unlocked: true, cost: 0 },
        sniper: { unlocked: false, cost: 3 },
        splash: { unlocked: false, cost: 4 },
        slow: { unlocked: false, cost: 5 },
        poison: { unlocked: false, cost: 6 },
        lightning: { unlocked: false, cost: 7 }
      }
    };

    this.totalWaves = this.WAVES.length;
    this.totalKills = 0; // 🔢 Track total kills
    this.enemies = [];
    this.lastTime = 0;
    this.towers = [];
    this.lives = GAME_CONFIG.STARTING_LIVES;
    this.gold = GAME_CONFIG.STARTING_GOLD;
  
    this.panel = document.getElementById('tower-panel');
    this.statsBox = document.getElementById('tower-stats');
    this.upgradeBtn = document.getElementById('upgrade-btn');
    this.sellBtn = document.getElementById('sell-btn');
  
    //this.bulletPool = new BulletPool(bulletImages['basic'], this);
    this.bulletPool = new BulletPool(bulletImages, this);
    this.enemyPool = new EnemyPool(PATH_POINTS, enemyImages['basic'], this);

    this.allTowerTypes = ['basic', 'sniper', 'splash', 'slow', 'poison', 'lightning'];
    this.towersPerPage = 3;
    this.currentTowerPage = 0;
    this.selectedTowerType = null;
    this.initTowerPanel();

    this.autoWave = false;

    this.towerPanelContainer = document.getElementById('tower-panel-container');
    this.towerToggleBtn = document.getElementById('tower-toggle-btn');

    const progress = this.loadProgress();
    this.diamonds = progress.diamonds;
    this.unlocks = progress.unlocks;
    this.achievementsUnlocked = progress.achievementsUnlocked;
    this.mapCompletionRewarded = false;
    this.mapCompleted = false; // ✅ prevent double reward


    this.initTowerPanel();
    this.towerToggleBtn.onclick = () => {
      this.towerPanelContainer.classList.toggle('hidden');
    };    

    this.waveTimer = 0;
    this.lastSpawnTime = 0;
    this.currentWave = 0;
    this.waveInterval = 1.0;
    this.waveIndex = 0;
    this.spawnQueue = [];
    this.nextSpawnTimer = 0;

    this.effects = [];// parachute effect?

    this.particles = new ParticlePool(100);

    this.hud = {
      lives: document.getElementById('lives'),
      gold: document.getElementById('gold'),
      wave: document.getElementById('wave'),
      diamonds: document.getElementById('diamonds'),
    };
    this.images = {
      tileImages,
      towerImages: {},
      enemyImages,
      bulletImages
    };
    
    this.nextWaveBtn = document.getElementById('next-wave-btn');
    
    
    this.isPaused = false;
    this.speedMultiplier = 1;
    if (!this.panel || !this.statsBox || !this.upgradeBtn || !this.sellBtn) {
      //console.warn('Tower panel UI elements not found. Check your HTML structure.');
    }

  }

  async init() {
    this.images.towerImages = await loadTowerImages();
    await this.map.load();
    this.handleInput();
    this.readyForNextWave = true;
    this.nextWaveContainer = document.getElementById('next-wave-container');
    this.nextWaveBtn = document.getElementById('next-wave-btn');
    const autoWaveToggle = document.getElementById('auto-wave-toggle');

    this.devMode = localStorage.getItem('DEV_MODE') === 'true';

    if (this.devMode) {
      this.enableDevTools();
    }


    autoWaveToggle.checked = this.autoWave;
    autoWaveToggle.onchange = (e) => {
      this.autoWave = e.target.checked;
    };

    document.getElementById('pause-btn').onclick = () => {
      this.isPaused = !this.isPaused;
    };
  
    document.getElementById('speed-btn').onclick = () => {
      this.speedMultiplier = this.speedMultiplier === 1 ? 2 : 1;
    };

    this.nextWaveBtn.onclick = () => {
      if (this.waveIndex < this.WAVES.length) {
        this.beginWave();
      }
    };
    

    if (this.readyForNextWave && !this.autoWave) {
      this.nextWaveContainer.style.display = 'block';
    }
  }

  get() {
    let enemy = this.pool.find(e => !e.active);
  
    if (!enemy) {
      enemy = new Enemy(this.path);
      this.pool.push(enemy);
    } else {
      enemy.reset(this.path);
    }
  
    enemy._deathHandled = false;   // ✅ Reset death flag
    enemy.onDeath = null;          // ✅ Remove any old callback
  
    return enemy;
  }

beginWave() {
  const wave = this.WAVES[this.waveIndex];

  if (!Array.isArray(wave)) {
    //console.warn('⚠️ Invalid wave data:', wave);
    this.showMessage('⚠️ No more waves.');
    return;
  }

  //console.log('[Wave] Starting wave', this.waveIndex);

  this.spawnQueue = [];

  for (const group of wave) {
    for (let i = 0; i < group.count; i++) {
      this.spawnQueue.push(group.type);
    }
  }

  //console.log('➡️ Enemies queued:', this.spawnQueue);

  this.enemiesPerWave = this.spawnQueue.length;
  this.enemiesSpawned = 0;
  this.waveTimer = 0;
  this.readyForNextWave = false;
  this.currentWave = this.waveIndex + 1;
  this.nextWaveContainer.style.display = 'none';
}

  
  
  start() {
    this.lastTime = performance.now(); // Ensure lastTime is initialized
    requestAnimationFrame(this.loop.bind(this));
  }
  
  loop(timestamp) {
    const deltaTime = (timestamp - this.lastTime) / 1000 * this.speedMultiplier;
    this.lastTime = timestamp;
  
    if (!this.isPaused) {
      this.update(deltaTime);
      this.render();
    }
  
    requestAnimationFrame(this.loop.bind(this));
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.map.draw(this.ctx);
    this.enemies.forEach(enemy => enemy.draw(this.ctx));
    this.towers.forEach(tower => tower.draw(this.ctx));
    this.towers.forEach(t => t.draw(this.ctx));
    this.bulletPool.draw(this.ctx);
    this.particles.draw(this.ctx);
  }
  

  update(dt) {
    for (const enemy of this.enemies) {
      enemy.update(dt);
      this.particles.update(dt);

      if (enemy.type === 'plane') {
        this.handlePlaneDrops(enemy, dt);
      }

      if (enemy.reachedEnd && enemy.active) {
        this.lives--;
        enemy.active = false;
        if (enemy.type === 'boss') {
          this.endGame('💀 A boss reached the end!');
          return;
        }
        if (this.lives <= 0) {
          this.endGame('Game Over! You ran out of lives.');
          return;
        }
      }
    }

    if (!this.readyForNextWave && this.spawnQueue.length > 0) {
      this.waveTimer += dt;
      const nextType = this.spawnQueue[0];
      const interval = this.getSpawnInterval(nextType);
      if (this.enemiesSpawned === 0 || this.waveTimer >= interval) {
        const type = this.spawnQueue.shift();
        this.spawnEnemy(type);
        this.waveTimer = 0;
        this.enemiesSpawned++;
      }
    }

    const waveDone = (
      this.enemiesSpawned === this.enemiesPerWave &&
      this.enemies.every(e => !e.active)
    );

    if (waveDone && !this.readyForNextWave) {
      this.waveIndex++;
      if (this.autoWave && this.waveIndex < this.WAVES.length) {
        this.beginWave();
      } else {
        this.readyForNextWave = true;
        this.nextWaveContainer.style.display = 'block';
      }
      this.checkAchievements();
    }

          // ✅ Check for game win condition
      const allWavesComplete = this.waveIndex >= this.WAVES.length;
      const allEnemiesCleared = this.enemies.length === 0 && this.enemiesSpawned === this.enemiesPerWave;

      if (allWavesComplete && allEnemiesCleared && !this.mapCompletionRewarded) {
        this.mapCompletionRewarded = true;
        this.mapCompleted = true;
        const earned = this.checkAchievements();
        this.saveProgress();
        
        const selectedLevel = parseInt(localStorage.getItem('selectedLevel'));
        const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
        const nextLevel = selectedLevel + 1;
        console.log('[Unlock Check]', { selectedLevel, unlockedLevel, nextLevel });
        this.endGame(`🏁 Victory! 💎 +${earned}`);
        if (nextLevel > unlockedLevel) {
          localStorage.setItem('unlockedLevel', nextLevel);
        }
        localStorage.removeItem('selectedLevel');
      }

    if (
      this.enemiesSpawned === this.enemiesPerWave &&
      this.enemies.every(e => !e.active) &&
      !this.readyForNextWave
    ) {
      this.readyForNextWave = true;
    
      if (!this.autoWave) {
        this.nextWaveContainer.style.display = 'block';
      } else {
        this.beginWave(); // auto trigger
      }
    }
    


    this.towers.forEach(t => t.update(dt, this.enemies, this.bulletPool));
    this.bulletPool.update(dt);
    this.enemies = this.enemies.filter(e => e.active);
    this.updateHUD();
  }

  updateHUD() {
    this.hud.lives.textContent = `💛 ${this.lives}`;
    this.hud.gold.textContent = `💰 ${this.gold}`;
    this.hud.wave.textContent = `🧿 ${this.currentWave} / ${this.totalWaves}`;
    this.hud.diamonds.textContent = `💎 ${this.diamonds}`;
  }

  spawnEnemy(type = 'basic', x = null, y = null, pathIndex = 0) {
    const stats = ENEMY_STATS[type] || ENEMY_STATS.basic;
    const enemy = this.enemyPool.get(type);
    enemy.image = this.images.enemyImages[type] || this.images.enemyImages.basic;
    enemy.speed = stats.speed;
    enemy.hp = stats.hp;
    enemy.maxHp = stats.hp;
    enemy.type = type;
    enemy.pathIndex = pathIndex;
  
    if (x !== null && y !== null) {
      enemy.x = x;
      enemy.y = y;
    }
  
    enemy.onDeath = () => {
      this.gold += stats.reward;
    };
  
    this.enemies.push(enemy);
  }
  

  showMessage(text) {
    const msgBox = document.getElementById('game-message');
    if (!msgBox) return;
    msgBox.textContent = text;
    msgBox.style.opacity = '1';
    setTimeout(() => {
      msgBox.style.opacity = '0';
    }, 2000);
  }

  handleInput() {
    this.ctx.canvas.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
  
      const tileX = Math.floor(mouseX / getTileSize());
      const tileY = Math.floor(mouseY / getTileSize());
  
      // Check if clicking a tower to select it
      const clickedTower = this.towers.find(t => t.x === tileX && t.y === tileY);
  
      if (clickedTower) {
        if (clickedTower.selected) {
          clickedTower.selected = false;
          this.panel.style.display = 'none';
        } else {
          this.towers.forEach(t => t.selected = false);
          clickedTower.selected = true;
          this.showTowerPanel(clickedTower);
        }
        return;
      }
  
      // Clicked somewhere else
      this.towers.forEach(t => t.selected = false);
      if (this.panel) this.panel.style.display = 'none';

  
      const type = this.MAP_DATA[tileY]?.[tileX];
      const allowedTiles = ['G', 'C1', 'C2', 'C3', 'C4', 'L', 'L1', , 'L2', 'L3'];

      if (allowedTiles.includes(type) && this.selectedTowerType) {
        const cost = TOWER_COSTS[this.selectedTowerType] || 25;

        if (this.gold >= cost) {
          const tower = this.createTower(tileX, tileY, this.selectedTowerType);
          if (tower) {
            this.towers.push(tower);
            this.gold -= TOWER_COSTS[this.selectedTowerType] || 25;
            this.updateHUD();
            this.selectedTowerType = null;
            this.renderTowerPanel?.();
          }

          this.initTowerPanel(); // 👈 Refresh icons
        } else {
          this.showMessage("Not enough gold to place tower!");
        }
      }
      

    });
  }

  showTowerPanel(tower) {
    const canvasRect = this.ctx.canvas.getBoundingClientRect();
  
    const upgradeCost = tower.getUpgradeCost();
    const centerX = tower.x * getTileSize() + getTileSize() / 2;
    const centerY = tower.y * getTileSize() + getTileSize();
  
    const tileSize = getTileSize();
    this.panel.style.left = `${tower.x * tileSize + tileSize / 2}px`;
    this.panel.style.top = `${tower.y * tileSize + tileSize * 2}px`;
    this.panel.style.transform = 'translate(-50%, -100%)'; // center above

    this.panel.style.position = 'absolute';
    this.panel.style.display = 'block';
  
    this.statsBox.innerHTML = `
      <strong>Tower Lv${tower.level}</strong><br>
      Fire Rate: ${tower.fireRate.toFixed(2)}/s<br>
      Damage: ${tower.damage}<br>
      Range: ${tower.range.toFixed(0)}px<br>
      Kills: ${tower.kills}<br>
      Upgrade Cost: 💰 ${upgradeCost}
    `;

  // ✅ Make sure buttons are visible
  this.upgradeBtn.style.display = 'inline-block';
  this.sellBtn.style.display = 'inline-block';
  
  this.upgradeBtn.onclick = () => {
    const cost = tower.getUpgradeCost();
    if (this.gold >= cost) {
      const success = tower.upgrade(cost); // ✅ pass cost here
      if (success) {
        this.gold -= cost;
        this.showTowerPanel(tower);
      } else {
        this.showMessage("This tower is fully upgraded!");
      }
    } else {
      this.showMessage("Not enough gold to upgrade tower!");
    }
  };
  
  
  this.sellBtn.onclick = () => {
    const baseCost = TOWER_COSTS[tower.type] || 25;
    const upgradeInvestment = tower.totalUpgradeCost || 0;
    const totalSpent = baseCost + upgradeInvestment;
  
    const refundRatio = 0.7; // 70% refund
    const refund = Math.floor(totalSpent * refundRatio);
  
    this.gold += refund;
    this.towers = this.towers.filter(t => t !== tower);
    this.panel.style.display = 'none';
    this.updateHUD();
  
    this.showMessage(`💰 Refunded ${refund} gold`);
  };
  
    
  }

  endGame(message) {
    this.paused = true;
    this.showMessage(message); // optional
    // Show Game Over overlay
    const overlay = document.getElementById('game-over-overlay');
    const msg = document.getElementById('game-over-message');
    if (overlay && msg) {
      msg.textContent = message;
      overlay.style.display = 'flex';
      
    }
  }

  loadProgress() {
    const saved = JSON.parse(localStorage.getItem('towerProgress'));
    const fallback = JSON.parse(JSON.stringify(GAME_PROGRESS_DEFAULTS));
    // Merge unlocks
    const mergedUnlocks = { ...fallback.unlocks };
    if (saved?.unlocks) {
      for (const key in saved.unlocks) {
        mergedUnlocks[key] = {
          ...mergedUnlocks[key],
          ...saved.unlocks[key]
        };
      }
    }
  
    // Always unlock basic tower
    mergedUnlocks.basic.unlocked = true;
  
    // Merge achievements
    const mergedAchievements = { ...fallback.achievementsUnlocked };
    if (saved?.achievementsUnlocked) {
      for (const id in saved.achievementsUnlocked) {
        mergedAchievements[id] = saved.achievementsUnlocked[id];
      }
    }
    this.totalKills = saved?.totalKills ?? 0;
    return {
      diamonds: saved?.diamonds ?? fallback.diamonds,
      unlocks: mergedUnlocks,
      achievementsUnlocked: mergedAchievements
    };
  }
  
  initTowerPanel() {
    const list = document.getElementById('tower-list');
    const upBtn = document.getElementById('tower-page-up');
    const downBtn = document.getElementById('tower-page-down');
  
    const renderPage = () => {
      list.innerHTML = '';
      const start = this.currentTowerPage * this.towersPerPage;
      const towers = this.allTowerTypes.slice(start, start + this.towersPerPage);
      list.innerHTML = ''; // Clear previous content

      towers.forEach(type => {
        const unlocked = this.unlocks?.[type]?.unlocked;
        const diamondCost = this.unlocks?.[type]?.cost ?? 0;
        const goldCost = TOWER_COSTS[type];
    
        const wrapper = document.createElement('div');
        wrapper.className = 'tower-wrapper';
    
        const img = document.createElement('img');
        img.src = `assets/images/towers/${type}.png`;
        img.dataset.type = type;
        img.className = 'tower-icon';
    
        if (this.selectedTowerType === type) {
          img.classList.add('selected');
        }
    
        if (!unlocked && type !== 'basic') {
          img.classList.add('locked');
          const overlay = document.createElement('div');
          overlay.className = 'diamond-overlay';
          overlay.textContent = `💎${diamondCost}`;
          wrapper.appendChild(overlay);
        } else {
          // ✅ Show gold cost below the tower
          const costLabel = document.createElement('div');
          costLabel.className = 'gold-cost';
          costLabel.textContent = `💰${goldCost}`;
          wrapper.appendChild(costLabel);
        }
    
        img.onclick = () => {
          if (type === 'basic' || unlocked) {
            this.selectedTowerType = (this.selectedTowerType === type) ? null : type;
            renderPage();
          } else {
            if (this.diamonds >= diamondCost) {
              const confirmUnlock = this.showConfirm(`Spend 💎${diamondCost} to unlock ${type}?`).then(confirmUnlock => {
                if (confirmUnlock) {
                  this.diamonds -= diamondCost;
                  this.unlocks[type].unlocked = true;
                  this.saveProgress();
                  this.showMessage(`${type} tower unlocked!`);
                  this.initTowerPanel();
                  this.updateHUD();
        
                  setTimeout(() => {
                    const icon = list.querySelector(`img[data-type="${type}"]`);
                    if (icon) {
                      icon.classList.add('unlocked-animate');
                      setTimeout(() => icon.classList.remove('unlocked-animate'), 300);
                    }
                  }, 100);
                } else {
                  this.showMessage("Cancelled.");
                }
              });
            } else {
              this.showMessage("Not enough diamonds to unlock this tower.");
            }
          }
        };
        
    
        wrapper.appendChild(img);
        list.appendChild(wrapper);
      });
    };
    
    upBtn.onclick = () => {
      if (this.currentTowerPage > 0) {
        this.currentTowerPage--;
        renderPage();
      }
    };
  
    downBtn.onclick = () => {
      const maxPage = Math.floor((this.allTowerTypes.length - 1) / this.towersPerPage);
      if (this.currentTowerPage < maxPage) {
        this.currentTowerPage++;
        renderPage();
      }
    };
  
    renderPage();
  }
  
  createTower(x, y, type) {
    const images = this.images.towerImages[type];
  
    switch (type) {
      case 'basic': return new BasicTower(x, y, images);
      case 'sniper': return new SniperTower(x, y, images);
      case 'splash': return new SplashTower(x, y, images);
      case 'slow': return new SlowTower(x, y, images);
      case 'poison': return new PoisonTower(x, y, images);
      case 'lightning': return new LightningTower(x, y, images);
      default: return null;
    }
  }

  checkAchievements() {
    const livesRatio = this.lives / GAME_CONFIG.STARTING_LIVES;
    let earnedDiamonds = 0;
  
    const unlock = (id) => {
      if (this.achievementsUnlocked[id]) return; // already unlocked
      if (this.achievementsAwardedThisSession[id]) return; // already awarded this run
  
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (!achievement) return;
  
      this.achievementsUnlocked[id] = true;
      this.achievementsAwardedThisSession[id] = true; // ✅ prevent same-session re-award
      this.diamonds += achievement.diamonds;
      earnedDiamonds += achievement.diamonds;
      this.showMessage(`🏆 ${achievement.label} +💎${achievement.diamonds}`);
      this.saveProgress();
      this.updateHUD?.();
    };
  
    if (this.totalKills >= 200) unlock('kill200');
    if (this.totalKills >= 450) unlock('kill450');
    if (this.totalKills >= 750) unlock('kill750');
    if (this.totalKills >= 1000) unlock('kill1000');
  
    if (this.mapCompletionRewarded) {
      unlock('completeMap');
      if (livesRatio >= 1.0) unlock('fullLives');
      else if (livesRatio >= 0.5) unlock('halfLives');
    }
  
    return earnedDiamonds;
  } //localStorage.setItem('towerProgress', JSON.stringify(GAME_PROGRESS_DEFAULTS)); reset local storage
  
  
  checkGameOver() {
    if (this.lives <= 0) {
      this.endGame('Game Over! You ran out of lives.');
      return true;
    }
    return false;
  }
  
  saveProgress() {
    localStorage.setItem('towerProgress', JSON.stringify({
      diamonds: this.diamonds,
      unlocks: this.unlocks,
      achievementsUnlocked: this.achievementsUnlocked,
      totalKills: this.totalKills 
    }));
  }

  getSpawnInterval(type) {
    const spawnDelays = {
      boss: 3.5,
      megaBoss: 3.5,
      tank: 1.5,
      fast: 0.5,
      plane: 2.5
      // Add more types here if needed
    };
  
    return spawnDelays[type] || 1.0; // Default to 1.0s if not specified
  }


  showConfirm(message) {
    return new Promise((resolve) => {
      document.getElementById('confirm-message').textContent = message;
      document.getElementById('confirm-overlay').style.display = 'flex';
  
      const yesBtn = document.getElementById('confirm-yes');
      const noBtn = document.getElementById('confirm-no');
  
      const cleanup = () => {
        document.getElementById('confirm-overlay').style.display = 'none';
        yesBtn.onclick = null;
        noBtn.onclick = null;
      };
  
      yesBtn.onclick = () => {
        cleanup();
        resolve(true);
      };
  
      noBtn.onclick = () => {
        cleanup();
        resolve(false);
      };
    });
  }

  enableDevTools() {
    const panel = document.getElementById('dev-panel');
    if (panel) panel.classList.remove('hidden');
  
    window.devAddGold = () => {
      this.gold += 1000;
      this.updateHUD?.();
    };
  
    window.devAddDiamonds = () => {
      this.diamonds += 100;
      this.updateHUD?.();
    };
  
    window.devReset = () => {
      localStorage.clear();
      location.reload();
    };

    const closeBtn = document.getElementById('dev-close-btn');
  if (closeBtn) {
    closeBtn.onclick = () => {
      localStorage.removeItem('DEV_MODE');
      panel.classList.add('hidden');
    };
  }

  }

  handlePlaneDrops(plane, dt) {
    const halfway = plane.path.length / 2;
  
    if (!plane.dropScheduled && plane.pathIndex < halfway) {
      plane.dropScheduled = true;
  
      const dropCount = Math.floor(Math.random() * 4) + 3;
      const dropInterval = 0.5; // .5 secs bewteen each enemy drop
      const allowedTypes = ['basic', 'fast', 'tank', 'splitter', 'stealth', 'healer'];
  
      plane.dropQueue = [];
      plane.dropTimer = 0;
  
      for (let i = 0; i < dropCount; i++) {
        const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
        plane.dropQueue.push({ delay: i * dropInterval, type, dropped: false });
      }
    }
  
    if (plane.dropQueue?.length) {
      plane.dropTimer += dt;
  
      for (const drop of plane.dropQueue) {
        if (!drop.dropped && plane.dropTimer >= drop.delay) {
          drop.dropped = true;
  
          const x = plane.x + (Math.random() * 30 - 15);
          const y = plane.y + (Math.random() * 30 - 15);
          this.spawnEnemy(drop.type, x, y, plane.pathIndex);
  
        }
      }
    }
  }

  
  
  
  
  
}
