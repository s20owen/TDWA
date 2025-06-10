import { getTileSize, GAME_CONFIG } from '../config.js';

export default class Enemy {
  constructor(path, image) {
    this.path = path;
    this.image = image;
    this.reset(path);
  }

  reset(path) {
    this.path = path;
    this.currentIndex = 0;
    this.x = path[0].x * getTileSize();
    this.y = path[0].y * getTileSize();
    this.reachedEnd = false;
    this.active = true;
    this.hp = GAME_CONFIG.ENEMY_HP;
    this.maxHp = GAME_CONFIG.ENEMY_HP;
    this.angle = 0;
    this.targetAngle = 0;
    this.hitRadius = getTileSize() * 0.575; // half of 1.15× TILE_SIZE
    this._deathHandled = false;
  }

  update(dt) {
    if (this.reachedEnd || !this.active || this.currentIndex >= this.path.length - 1) return;

    const next = this.path[this.currentIndex + 1];
    const targetX = next.x * getTileSize();
    const targetY = next.y * getTileSize();
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    this.targetAngle = Math.atan2(dy, dx);
    let deltaAngle = this.targetAngle - this.angle;
    deltaAngle = ((deltaAngle + Math.PI) % (2 * Math.PI)) - Math.PI;
    this.angle += deltaAngle * 10 * dt;

    if (dist < this.hitRadius) {
      this.currentIndex++;
      if (this.currentIndex >= this.path.length - 1) {
        this.reachedEnd = true;
        this.active = true;
      }
      return;
    }

    let currentSpeed = this.speed;

    // Apply slow if active
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      currentSpeed *= this.speedModifier;
    }

    // Apply poison if active
    if (this.poisonTimer > 0) {
      this.poisonTimer -= dt;
      const poisonDamage = this.poisonDPS * dt;
      this.takeDamage(poisonDamage);
    }


    const speed = this.speed || 50;
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;
    this.x += vx * dt;
    this.y += vy * dt;
  }

  draw(ctx) {
    if (!this.active || !this.image) return;

    const scale = 1.30; // 30% larger
    const size = getTileSize() * scale; // enemy size
    ctx.save();
    ctx.translate(this.x + getTileSize() / 2, this.y + getTileSize() / 2);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, -size / 2, -size / 2, size, size);
    ctx.restore();

    // HP bar
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y -6, getTileSize(), 4);
    ctx.fillStyle = 'lime';
    const hpWidth = (this.hp / this.maxHp) * getTileSize();
    ctx.fillRect(this.x, this.y -6, hpWidth, 4);
  }

  takeDamage(amount) {
    if (!this.active || this._deathHandled) return;
  
    this.hp -= amount;
  
    if (this.hp <= 0) {
      this._deathHandled = true;
      this.active = false;
  
      // ✅ Do NOT increment totalKills here — it happens in Bullet logic
      if (this.onDeath) {
        this.onDeath();
        this.onDeath = null;
      }
  
      return;
    }
  }
  
  
  isAlive() {
    return this.active && !this.reachedEnd;
  }

  applySlow(factor, duration) {
    this.speedModifier = factor;
    this.slowTimer = duration;
  }
  
  applyPoison(dps, duration) {
    this.poisonDPS = dps;
    this.poisonTimer = duration;
  }
  
}
