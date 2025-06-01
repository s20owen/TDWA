import { preloadImages } from './utils.js';
// 32x32 26 cols 11 rows
// 64x64 5 cols 13 rows

//export const TILE_SIZE = 32;

let tileSize = 32;


export function getTileSize() {
  return tileSize;
}

export const MAP_DATA = [
    [ 'G',  'L',  'S',   'L1',   'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',  'G',    'G',   'G',   'G',   'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'L',  'P1',  'L1',   'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',  'G',    'G',   'G',   'G',   'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'L',  'P2',  'C2',   'L3', 'L3',   'L3',   'L3',   'L3',  'L3',  'C4',  'G',   'G',    'G',   'T',   'G',    'G',  'G',    'G',   'G',   'G',   'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'L',  'P3',  'P4',   'P5', 'P6',   'P7',   'P8',   'P9',  'P10', 'L1',  'G',   'G',    'G',   'G',   'G',    'G',  'G',    'G',   'G',   'G',   'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'C1', 'L2',  'L2',   'L2', 'L2',   'L2',   'L2',   'C3',  'P11', 'C2',  'G',   'G',    'G',   'G',   'G',    'G',  'G',    'G',   'T',   'G',   'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'T',  'P22',  'P23',  'P24',  'P25', 'P12', 'P26', 'P27', 'P28',  'P29', 'P30', 'P31',  'G',  'G',    'G',   'G',   'G',   'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'P21',  'G',    'G',    'G',   'P13', 'G',   'G',   'G',    'G',   'G',   'P32',  'G',   'G',   'G',   'G',   'G',   'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'P20',  'G',    'G',    'G',   'P14', 'G',   'G',   'G',    'G',   'G',   'P33',  'P34', 'P35', 'P36', 'P37', 'P38', 'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'P19',  'P18',  'P17',  'P16', 'P15', 'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',  'G',   'P39', 'G',  'T',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'T',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',  'G',   'P40', 'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',  'G',   'P41', 'G',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',  'T',   'P42', 'T',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',  'T',   'E',   'T',  'G',  'G',  'G',  'G', 'G']
  ];

export const TILE_IMAGES = {
  S: 'assets/images/tiles/path_start.png',
  G: 'assets/images/tiles/grass.png',
  E: 'assets/images/tiles/path_end.png',
  T: 'assets/images/tiles/tree.png',
  P: 'assets/images/tiles/path.png',
  C1: 'assets/images/tiles/cornerL.png',
  C2: 'assets/images/tiles/cornerR.png',
  C3: 'assets/images/tiles/cornerBoth.png',
  C4: 'assets/images/tiles/cornerLR.png',
  L: 'assets/images/tiles/L.png',
  L1: 'assets/images/tiles/L1.png',
  L2: 'assets/images/tiles/L2.png',
  L3: 'assets/images/tiles/L3.png'
};

export const ENEMY_IMAGES = {
  basic: 'assets/images/enemies/baddie.svg',
  fast: 'assets/images/enemies/fast.svg',
  tank: 'assets/images/enemies/tank.svg',
  splitter: 'assets/images/enemies/baddie.svg',
  boss: 'assets/images/enemies/boss.svg',
  healer: 'assets/images/enemies/healer.svg'
};


export const TOWER_LEVELS = [1, 2, 3, 4];

export async function loadTowerImages() {
  const towerTypes = ['basic', 'sniper', 'splash', 'slow', 'poison', 'lightning'];
  const levels = TOWER_LEVELS;

  const imageMap = {
    base: 'assets/images/towers/base.png',
  };

  for (const type of towerTypes) {
    for (const level of levels) {
      const key = `${type}_turret_${level}`;
      imageMap[key] = `assets/images/towers/${type}/turret_lvl${level}.svg`;
    }
  }

  const loaded = await preloadImages(imageMap);

  const result = {};

  for (const type of towerTypes) {
    const turret = {};
    for (const level of levels) {
      turret[level] = loaded[`${type}_turret_${level}`];
    }

    result[type] = {
      base: loaded.base,
      turret
    };
  }

  return result; // Use this as `this.images.towerImages`
}

export const BULLET_IMAGES = {
  basic: 'assets/images/bullets/basic.png'
};

export const GAME_CONFIG = {
  STARTING_LIVES: 10,
  STARTING_GOLD: 25,
  ENEMY_HP: 3,
  ENEMY_REWARD: 7,
  TOWER_DAMAGE: 1,
  MAX_WAVES: 30
};

export const TOWER_COSTS = {
  basic: 25,
  sniper: 40,
  splash: 50,
  slow: 45,
  poison: 55,
  lightning: 60
};

export const WAVES = [
  [{ type: 'basic', count: 5 }],
  [{ type: 'basic', count: 8 }],
  [{ type: 'fast', count: 2 }],
  [{ type: 'fast', count: 2 }, { type: 'basic', count: 12 }],
  [{ type: 'tank', count: 2 }, { type: 'basic', count: 5 }, { type: 'fast', count: 2 }],
  [{ type: 'tank', count: 5 }],
  [{ type: 'tank', count: 10 }],
  [{ type: 'boss', count: 1 }]
];

export const ENEMY_STATS = {
  basic:    { hp: 3, speed: 50, reward: 5 },
  fast:     { hp: 2, speed: 80, reward: 7 },
  tank:     { hp: 10, speed: 30, reward: 10 },
  splitter: { hp: 4, speed: 45, reward: 7 },
  boss:     { hp: 50, speed: 25, reward: 25 },
  healer:   { hp: 2, speed: 60, reward: 5}
};


export const TOWER_UNLOCKS = {
  basic: { unlocked: true, cost: 0 },
  sniper: { unlocked: false, cost: 3 },
  splash: { unlocked: false, cost: 4 },
  slow: { unlocked: false, cost: 5 },
  poison: { unlocked: false, cost: 7 },
  lightning: { unlocked: false, cost: 10 }
};

export const GAME_PROGRESS_DEFAULTS = {
  diamonds: 0,
  unlocks: TOWER_UNLOCKS
};


export const ACHIEVEMENTS = [
  { id: 'kill100', label: 'Slay 100 Enemies', diamonds: 1 },
  { id: 'kill250', label: 'Slay 250 Enemies', diamonds: 1 },
  { id: 'completeMap', label: 'Map Complete', diamonds: 1 },
  { id: 'halfLives', label: 'Map Complete (50%+ Lives)', diamonds: 1 },
  { id: 'fullLives', label: 'Map Complete (All Lives)', diamonds: 1 }
];



export function extractPathPoints(map) {
  const points = [];

  // Find all path tiles and associate them with their numeric index
  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === 'S') {
        points.push({ x, y, order: 0 });
      } else if (tile === 'E') {
        points.push({ x, y, order: 999 }); // End comes last
      } else if (tile.startsWith('P')) {
        const order = parseInt(tile.slice(1), 10);
        if (!isNaN(order)) {
          points.push({ x, y, order });
        }
      }
    });
  });

  // Sort by order
  points.sort((a, b) => a.order - b.order);

  // Strip order field
  return points.map(p => ({ x: p.x, y: p.y }));
}

/*
export const TILE_IMAGES = {
    G: 'assets/images/tiles/grass.png',
    S: 'assets/images/tiles/path_start.png',
    E: 'assets/images/tiles/path_end.png',
    R: 'assets/images/tiles/rock.png',
    T: 'assets/images/tiles/tree.png',
    B: 'assets/images/tiles/bush.png',
    L: 'assets/images/tiles/grass_line.png',
    P1: 'assets/images/tiles/path1.png',
    P2: 'assets/images/tiles/path2.png',
    P3: 'assets/images/tiles/path3.png',
    P4: 'assets/images/tiles/path4.png',
    P5: 'assets/images/tiles/path5.png',
    P6: 'assets/images/tiles/path6.png',
    P7: 'assets/images/tiles/path7.png',
    P8: 'assets/images/tiles/path8.png',
    P9: 'assets/images/tiles/path9.png',
    P10: 'assets/images/tiles/path10.png',
    C1: 'assets/images/tiles/corner1.png',
    C2: 'assets/images/tiles/corner2.png',
    C3: 'assets/images/tiles/corner3.png',
    C4: 'assets/images/tiles/corner4.png',
    C5: 'assets/images/tiles/corner5.png',
    C6: 'assets/images/tiles/corner6.png',
    C7: 'assets/images/tiles/corner7.png',
    C8: 'assets/images/tiles/corner8.png',
  };
  */
