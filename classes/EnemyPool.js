import Enemy from './Enemy.js';

export class EnemyPool {
  constructor(path, image, gameRef) {
    this.pool = [];
    this.path = path;
    this.image = image;
    this.gameRef = gameRef;
  }

  get() {
    let enemy = this.pool.find(e => !e.active);
  
    if (!enemy) {
      enemy = new Enemy(this.path, this.image);
      this.pool.push(enemy);
    }
    enemy.reset(this.path);
    enemy.gameRef = this.gameRef;
    return enemy;
  }
  

  getActiveEnemies() {
    return this.pool.filter(e => e.active);
  }
}
