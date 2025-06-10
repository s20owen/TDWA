import { getTileSize } from '../config.js';

export default class Bullet {
  constructor(image, gameRef) {
    this.active = false;
    this.image = image;
    this.gameRef = gameRef;
    this.reset();
  }

  reset() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.speed = 400;
    this.target = null;
    this.angle = 0;
    this.sourceTower = null;
    this.effect = null;
    this.enemies = [];
    this.lifetime = 0;
  }

  fire(x, y, target, sourceTower, effect = {}, enemies = []) {
    this.reset(); // Clear old state
    this.active = true;
    this.x = x;
    this.y = y;
    this.target = target;
    this.sourceTower = sourceTower;
    this.effect = effect;
    this.enemies = enemies;

    const dx = (target.x + getTileSize() / 2) - x;
    const dy = (target.y + getTileSize() / 2) - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
    this.angle = Math.atan2(dy, dx);
  }

  update(dt) {
    if (!this.active || !this.target || !this.target.active) {
      this.reset();
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const dx = (this.target.x + getTileSize() / 2) - this.x;
    const dy = (this.target.y + getTileSize() / 2) - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 10) {
      this.target.takeDamage(this.sourceTower?.damage || 1);

      if (!this.target.active && this.sourceTower) {
        this.sourceTower.kills++;
        if (this.gameRef) {
          this.gameRef.totalKills++; // ✅ increment kill count
          this.gameRef.saveProgress();
        }
      }

      // Splash
      if (this.effect?.splash && this.enemies?.length) {
        const radius = this.effect.splashRadius || getTileSize() * 2;
        const splashDmg = this.effect.splashDamage || this.sourceTower?.damage || 1;
      
        if (this.gameRef?.particles) {
          this.gameRef.particles.emitBurst(this.x, this.y, 12, ['#ff4d00', '#ffa500', '#ffff66', '#ffffff']);
        }
        
        for (const enemy of this.enemies) {
          if (enemy !== this.target && enemy.active) {
            const dx = (enemy.x - this.x);
            const dy = (enemy.y - this.y);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= radius) {
              enemy.takeDamage(splashDmg);
            }
          }
        }
      }

      // Slow
      if (this.effect?.slow && this.target.applySlow) {
        this.target.applySlow(this.effect.slowFactor, this.effect.slowDuration);
      }

      // Poison
      if (this.effect?.poison && this.target.applyPoison) {
        const { damagePerSecond, duration } = this.effect.dot || {};
        this.target.applyPoison(damagePerSecond || 0.5, duration || 3);
      }

      // Chain Lightning
      if (this.effect?.chain && this.enemies?.length > 0) {
        let remainingChains = this.effect.chainCount || 3;
        let current = this.target;
        const chained = new Set([current]);

        while (remainingChains > 0) {
          let closest = null;
          let closestDist = Infinity;

          for (const enemy of this.enemies) {
            if (!enemy.active || chained.has(enemy)) continue;

            const dx = enemy.x - current.x;
            const dy = enemy.y - current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < getTileSize() * 2 && dist < closestDist) {
              closest = enemy;
              closestDist = dist;
            }
          }

          if (closest) {
            closest.takeDamage(this.sourceTower?.damage || 1);
            chained.add(closest);
            current = closest;
            remainingChains--;
          } else break;
        }
      }

      this.reset();
      return;
    }

    // Timeout
    this.lifetime += dt;
    if (this.lifetime > 5) {
      this.reset();
    }
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    if (this.image) {
      ctx.drawImage(
        this.image,
        -getTileSize() / 4,
        -getTileSize() / 4,
        getTileSize() / 3,
        getTileSize() / 3
      );
    }
    ctx.restore();
  }
}

export class BulletPool {
  constructor(imageMap, gameRef) {
    this.images = imageMap; // { basic: ..., splash: ..., etc. }
    this.pool = [];
    for (const type in imageMap) {
      for (let i = 0; i < 30; i++) { // 10 bullets per type × N types = ~50 total
        this.pool.push(new Bullet(imageMap[type], gameRef));
      }
    }
    this.gameRef = gameRef;
  }

  get(bulletType = 'basic') {
    const image = this.images[bulletType] || this.images.basic;
    
    let bullet = this.pool.find(b => !b.active);
    if (!bullet) {
      bullet = new Bullet(image, this.gameRef);
      this.pool.push(bullet);
    } else {
      bullet.image = image; // ✅ overwrite with correct image
    }
    bullet.reset();
    return bullet;
  }

  update(dt) {
    this.pool.forEach(b => b.update(dt));
  }

  draw(ctx) {
    this.pool.forEach(b => b.draw(ctx));
  }
}
