import { getTileSize } from '../config.js';

export default class Tile {
  constructor(x, y, type, image) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.image = image;
  }

  draw(ctx) {
    if (!this.image) return;
    ctx.drawImage(
      this.image,
      this.x * getTileSize(),
      this.y * getTileSize(),
      getTileSize(),
      getTileSize()
    );
  }
}
