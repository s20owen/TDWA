import { getTileSize, GAME_CONFIG, TOWER_LEVELS } from '../config.js';


export default class Tower {
  constructor(x, y, images) {
    this.x = x;
    this.y = y;
    this.range = 2.5 * getTileSize();
    this.fireRate = 1.7;
    this.cooldown = 0;
    this.damage = GAME_CONFIG.TOWER_DAMAGE;
    this.kills = 0;
    this.level = 1;
    this.selected = false;
    this.angle = 0;
    // ✅ Use a single base image and turret images per level
    this.baseImage = images.base;              // Static image
    this.turretImages = images.turret;         // Object: { 1: Image, 2: Image, 3: Image }
    this.turretImage = this.turretImages[1];   // Start with level 1
  }

  update(deltaTime, enemies, bulletPool) {
    if (this.cooldown > 0) {
      this.cooldown -= deltaTime;
    }

    const centerX = this.x * getTileSize() + getTileSize() / 2;
    const centerY = this.y * getTileSize() + getTileSize() / 2;

    for (const enemy of enemies) {
      const dx = (enemy.x + getTileSize() / 2) - centerX;
      const dy = (enemy.y + getTileSize() / 2) - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= this.range) {
        const targetAngle = Math.atan2(dy, dx);
        this.angle += (targetAngle - this.angle) * 10 * deltaTime;

        if (this.cooldown <= 0) {
          const bullet = bulletPool.get();
          if (bullet) {
            // Offset bullet spawn to appear from turret tip
            const barrelLength = getTileSize() * 0.45; // adjust if needed
            const spawnX = centerX + Math.cos(this.angle) * barrelLength;
            const spawnY = centerY + Math.sin(this.angle) * barrelLength;
        
            bullet.fire(spawnX, spawnY, enemy, this);
            this.cooldown = 1 / this.fireRate;
          }
        }
        

        break;
      }
    }
  }

  draw(ctx) {
    const posX = this.x * getTileSize();
    const posY = this.y * getTileSize();

    // ✅ Draw base
    if (this.baseImage) {
      ctx.drawImage(this.baseImage, posX, posY, getTileSize(), getTileSize());
    }

    // ✅ Draw range if selected
    if (this.selected) {
      const centerX = posX + getTileSize() / 2;
      const centerY = posY + getTileSize() / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, this.range, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 128, 255, 0.1)';
      ctx.fill();
    }

    // ✅ Draw turret (rotates)
    if (this.turretImage) {
      const cx = posX + getTileSize() / 2;
      const cy = posY + getTileSize() / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(this.angle + Math.PI / 2); // tower faces up
      ctx.drawImage(this.turretImage, -getTileSize() / 2, -getTileSize() / 2, getTileSize(), getTileSize());
      ctx.restore();
    }

    // Draw level
    //ctx.fillStyle = 'white';
    //ctx.font = '12px Arial';
    //ctx.fillText(`Lv${this.level}`, posX + 6, posY + 30);
  }

  getUpgradeCost() {
    //return 25 + (this.level - 1) * 15; // Example: 25 → 40 → 55...
    return 50;
  }
  
  upgrade(cost) {
    if (this.level < TOWER_LEVELS.length) {
      this.level++;
      this.damage = Math.round(this.damage * 1.1 * 10) / 10;
      this.fireRate = Math.round(this.fireRate * 1.1 * 10) / 10;
      this.range += 4;
  
      const maxLevel = Math.max(...Object.keys(this.turretImages).map(n => parseInt(n)));
      const newLevel = Math.min(this.level, maxLevel);
      this.turretImage = this.turretImages[newLevel];
  
      this.totalUpgradeCost = (this.totalUpgradeCost || 0) + cost;
      return true;
    } else {
      return false;
    }
  }
  
  
  
}

