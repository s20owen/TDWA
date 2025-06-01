import Tower from './Tower.js';
import { getTileSize } from '../config.js';

export default class PoisonTower extends Tower {
  constructor(x, y, images) {
    super(x, y, images);
    this.range = 2.5 * getTileSize();
    this.fireRate = 1;
    this.damage = 1;
    this.dot = { damagePerSecond: 0.5, duration: 3 };
  }

  update(dt, enemies, bulletPool) {
    if (this.cooldown > 0) this.cooldown -= dt;

    const centerX = this.x * getTileSize() + getTileSize() / 2;
    const centerY = this.y * getTileSize() + getTileSize() / 2;

    for (const enemy of enemies) {
      const dx = (enemy.x + getTileSize() / 2) - centerX;
      const dy = (enemy.y + getTileSize() / 2) - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= this.range) {
        this.angle = Math.atan2(dy, dx);

        if (this.cooldown <= 0) {
          const bullet = bulletPool.get();
          if (bullet) {
            bullet.fire(centerX, centerY, enemy, this, {
              poison: true,
              dot: this.dot
            });
            this.cooldown = 1 / this.fireRate;
          }
        }
        break;
      }
    }
  }
}
