export default class Particle {
  constructor() {
    this.active = false;
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 0;
    this.maxLife = 0.5;
    this.size = 2 + Math.random() * 2;
    this.color = 'orange';
    this.alpha = 1.0;
    this.active = false;
  }

  init(x, y, angle, speed, colorPalette = ['orange']) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 0;
    this.maxLife = 0.4 + Math.random() * 0.2;
    this.size = 2 + Math.random() * 2;
    this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    this.alpha = 1.0;
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;

    this.life += dt;
    if (this.life >= this.maxLife) {
      this.active = false;
      return;
    }

    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.alpha = 1 - this.life / this.maxLife;
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class ParticlePool {
  constructor(size = 100) {
    this.pool = Array.from({ length: size }, () => new Particle());
  }

  emitBurst(x, y, count = 10, colorPalette = ['#ff4d00', '#ffa500', '#ffff66', '#ffffff']) {
    for (let i = 0; i < count; i++) {
      const particle = this.pool.find(p => !p.active);
      if (particle) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        particle.init(x, y, angle, speed, colorPalette);
      }
    }
  }

  update(dt) {
    this.pool.forEach(p => p.update(dt));
  }

  draw(ctx) {
    this.pool.forEach(p => p.draw(ctx));
  }
}

