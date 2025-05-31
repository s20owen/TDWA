import Tile from './Tile.js';
import { getTileSize, MAP_DATA } from '../config.js';

export default class GameMap {
  constructor(tileImages) {
    this.tiles = [];
    this.images = tileImages;
  }

  async load() {
    MAP_DATA.forEach((row, y) => {
      row.forEach((type, x) => {
        const image = this.getTileImage(type);
        this.tiles.push(new Tile(x, y, type, image));
      });
    });
  }

  getTileImage(type) {
    if (this.images[type]) return this.images[type];
    if (type.startsWith('P') && this.images['P']) return this.images['P'];
    if (type.startsWith('C') && this.images['C1']) return this.images['C1'];
    if (type.startsWith('L') && this.images['L']) return this.images['L'];
    return this.images['G']; // default to grass
  }

  draw(ctx) {
    this.tiles.forEach(tile => tile.draw(ctx));
  }
}
