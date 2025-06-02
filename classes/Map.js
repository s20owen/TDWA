/*import Tile from './Tile.js';
import { getTileSize } from '../config.js';

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
    if (type.startsWith('L') && this.images['L1']) return this.images['L1'];
    if (type.startsWith('L') && this.images['L2']) return this.images['L2'];
    if (type.startsWith('L') && this.images['L3']) return this.images['L3'];
    return this.images['G']; // default to grass
  }

  draw(ctx) {
    this.tiles.forEach(tile => tile.draw(ctx));
  }
}*/
import Tile from './Tile.js';
import { getTileSize } from '../config.js';

export default class GameMap {
  constructor(tileImages, mapData) {
    this.tiles = [];
    this.images = tileImages;
    this.mapData = mapData;
  }

  async load() {
    this.mapData.forEach((row, y) => {
      row.forEach((type, x) => {
        const image = this.getTileImage(type);
        this.tiles.push(new Tile(x, y, type, image));
      });
    });
  }

  getTileImage(type) {
    if (this.images[type]) return this.images[type];
    if (type.startsWith('P') && this.images['P']) return this.images['P'];
    if (type.startsWith('C1') && this.images['C1']) return this.images['C1'];
    if (type.startsWith('C2') && this.images['C2']) return this.images['C2'];
    if (type.startsWith('C3') && this.images['C3']) return this.images['C3'];
    if (type.startsWith('C4') && this.images['C4']) return this.images['C4'];
    if (type.startsWith('C5') && this.images['C5']) return this.images['C5'];
    if (type.startsWith('L4') && this.images['L4']) return this.images['L4'];
    if (type.startsWith('L3') && this.images['L3']) return this.images['L3'];
    if (type.startsWith('L2') && this.images['L2']) return this.images['L2'];
    if (type.startsWith('L1') && this.images['L1']) return this.images['L1'];
    return this.images['G'];
  }

  draw(ctx) {
    this.tiles.forEach(tile => tile.draw(ctx));
  }
}
