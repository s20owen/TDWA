import Tower from './Tower.js';
import { getTileSize } from '../config.js';


export default class SniperTower extends Tower {
  constructor(x, y, images) {
    super(x, y, images);
    this.range = 5 * getTileSize();
    this.fireRate = 0.5;
    this.damage = 5;
    const turretImage = this.images.turret[this.level] || this.images.turret[3]; // fallback to level 3
  }

  upgrade() {
    if (this.level < 3) {
      this.level++;
      this.damage += 5;
      this.fireRate *= 0.95;
      this.range += 20;
    }
  }
}
