import Tower from './Tower.js';
import { getTileSize } from '../config.js';


export default class SniperTower extends Tower {
  constructor(x, y, images) {
    super(x, y, images);
    this.range = 5 * getTileSize();
    this.fireRate = 0.5;
    this.damage = 5;

    const level = this.level || 1;
    if (images.turret) {
      this.turretImage = images.turret[level] || images.turret[3];
    }
  }

  upgrade() {
    if (this.level < 3) {
      this.level++;
      this.damage += 5;
      this.fireRate *= 0.95;
      this.range += 20;

      const maxLevel = Math.max(...Object.keys(this.turretImages || {}).map(n => parseInt(n)));
      const newLevel = Math.min(this.level, maxLevel);
      if (this.turretImages) {
        this.turretImage = this.turretImages[newLevel];
      }
    }
  }
}
