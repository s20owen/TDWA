import { preloadImages } from './utils.js';
// 32x32 26 cols 11 rows
// 64x64 5 cols 13 rows

let tileSize = 32;

export function getTileSize() {
  return tileSize;
}
// 13 x27
export const MAP_DATA_1 = [
    [ 'G',  'G',  'S',   'G',    'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'G',   'G',    'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'P1',  'G',    'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'G',   'G',    'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'P2',  'G',    'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'T',   'G',    'G',   'G',    'G',   'G',   'G',   'G',    'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'P3',  'P4',   'P5', 'P6',   'P7',   'P8',   'P9',  'P10', 'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'G',   'G',    'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'G',    'G',    'G',    'G',   'P11', 'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'T',   'G',   'G',    'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'G',    'G',    'G',    'G',   'P12', 'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'G',   'G',    'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'P23',  'P24',  'P25',  'P26', 'P13', 'P27', 'P28', 'P29',  'P30', 'P31', 'P32',  'P33', 'P34',  'P35', 'P36', 'P37', 'P38',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'P22',  'G',    'G',    'G',   'P14', 'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'G',   'P39',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'T',   'G',    'G',  'P21',  'G',    'G',    'G',   'P15', 'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'G',   'P40',  'T',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'P20',  'P19',  'P18',  'P17', 'P16', 'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'G',   'P41',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'G',   'P42',  'G',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'T',   'P43',  'T',  'G',  'G',  'G', 'G'],
    [ 'G',  'G',  'G',   'G',    'G',  'G',    'G',    'G',    'G',   'G',   'G',   'G',   'G',    'G',   'G',   'G',    'G',   'G',    'G',   'G',   'T',   'E',    'T',  'G',  'G',  'G', 'G']
  ];

  export const MAP_DATA_2 = [
    [ 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G' ],
    [ 'G', 'T', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G' ],
    [ 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G' ],
    [ 'G', 'T', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G' ],
    [ 'G', 'G', 'T', 'G', 'G', 'G', 'P13', 'P14', 'P15', 'P16', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'G' ],
    [ 'G', 'T', 'G', 'G', 'G', 'G', 'P12', 'G', 'G', 'P17', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G' ],
    [ 'T', 'G', 'G', 'G', 'G', 'G', 'P11', 'G', 'G', 'P18', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G' ],
    [ 'G', 'G', 'G', 'T', 'G', 'G', 'P10', 'G', 'G', 'P19', 'P20', 'P21', 'P22', 'P23', 'P24', 'P25', 'P26', 'P27', 'P28', 'P29', 'P30', 'P31', 'G', 'G', 'G', 'G', 'G' ],
    [ 'T', 'G', 'P5', 'P6', 'P7', 'P8', 'P9', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'P32', 'G', 'G', 'G', 'G', 'G' ],
    [ 'G', 'G', 'P4', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'P33', 'G', 'G', 'G', 'G', 'G' ],
    [ 'T', 'G', 'P3', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'P34', 'T', 'G', 'G', 'T', 'G' ],
    [ 'S', 'P1', 'P2', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'P35', 'T', 'G', 'G', 'G', 'G' ],
    [ 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'E', 'T', 'G', 'G', 'G', 'G' ],
  ];

  // Test wave
  /*
  export const WAVES_1 = [
    [{ type: 'basic', count: 7 }]
    
  ];*/
  // level 1 waves
  export const WAVES_1 = [
    [{ type: 'basic', count: 7 }],
    [{ type: 'basic', count: 14 }],
    [{ type: 'basic', count: 21}],
    [{ type: 'fast', count: 2 }, { type: 'basic', count: 21 }],
    [{ type: 'fast', count: 8 }, { type: 'basic', count: 28 }],
    [{ type: 'tank', count: 5 }],
    [{ type: 'tank', count: 15 }, { type: 'basic', count: 5 }],
    [{ type: 'tank', count: 27 }, { type: 'basic', count: 7 }],
    [{ type: 'tank', count: 32 }, { type: 'fast', count: 3 }],
    [{ type: 'tank', count: 32 }, { type: 'fast', count: 10 }],
    [{ type: 'boss', count: 5 }],
    [{ type: 'boss', count: 10 }],
    [{ type: 'boss', count: 15 }],
    [{ type: 'boss', count: 20 }],
    [{ type: 'boss', count: 25 }, {type: 'plane', count: 2}]
  ];
  
// level 2 waves
  export const WAVES_2 = [
    [{ type: 'basic', count: 7 }],
    [{ type: 'basic', count: 14 }],
    [{ type: 'basic', count: 21}],
    [{ type: 'fast', count: 2 }, { type: 'basic', count: 21 }],
    [{ type: 'fast', count: 8 }, { type: 'basic', count: 28 }],
    [{ type: 'tank', count: 20 }],
    [{ type: 'tank', count: 15 }, { type: 'basic', count: 5 }],
    [{ type: 'tank', count: 27 }, { type: 'basic', count: 7 }],
    [{ type: 'tank', count: 32 }, { type: 'fast', count: 3 }],
    [{ type: 'tank', count: 32 }, { type: 'fast', count: 10 }],
    [{ type: 'boss', count: 3 }],
    [{ type: 'boss', count: 5 }],
    [{ type: 'boss', count: 8 }],
    [{ type: 'boss', count: 12 }, {type: 'plane', count: 2}],
    [{ type: 'boss', count: 15 }, {type: 'plane', count: 4}]
  ];
  
// default grass/dirt tiles
export const TILE_IMAGES_DEFAULT = {
  S: 'assets/images/tiles/path.svg',
  G: 'assets/images/tiles/grass.svg',
  E: 'assets/images/tiles/path.svg',
  T: 'assets/images/tiles/tree.svg',
  P: 'assets/images/tiles/path.svg',
  C1: 'assets/images/tiles/C1.svg',
  C2: 'assets/images/tiles/C2.svg',
  C3: 'assets/images/tiles/C3.svg',
  C4: 'assets/images/tiles/C4.svg',
  C5: 'assets/images/tiles/C5.svg',
  L1: 'assets/images/tiles/L1.svg',
  L2: 'assets/images/tiles/L2.svg',
  L3: 'assets/images/tiles/L3.svg',
  L4: 'assets/images/tiles/L4.svg'
};

// different level tiles: beach, airport, snow etc.
export const TILE_IMAGES_BEACH = {
  S: 'assets/images/tiles/sand.svg',
  G: 'assets/images/tiles/beach_grass.svg',
  T: 'assets/images/tiles/palm_tree.svg',
  P: 'assets/images/tiles/sand_path.svg',
  E: 'assets/images/tiles/sand_end.svg',
};

export const ENEMY_IMAGES = {
  basic: 'assets/images/enemies/baddie.svg',
  fast: 'assets/images/enemies/fast.svg',
  tank: 'assets/images/enemies/tank.svg',
  splitter: 'assets/images/enemies/baddie.svg',
  boss: 'assets/images/enemies/boss.svg',
  healer: 'assets/images/enemies/healer.svg',
  plane: 'assets/images/enemies/plane.svg'
};

export const LEVELS = {
  1: {
    map: MAP_DATA_1,
    waves: WAVES_1,
    preview: 'assets/images/maps/level1.png',
    tiles: TILE_IMAGES_DEFAULT,
    unlockAfter: null
  },
  2: {
    map: MAP_DATA_2,
    waves: WAVES_2,
    preview: 'assets/images/maps/level2.png',
    tiles: TILE_IMAGES_DEFAULT,
    unlockAfter: { level: 1 }
  }
};


export const TOWER_LEVELS = [1, 2, 3, 4];

export const GAME_CONFIG = {
  STARTING_LIVES: 10,
  STARTING_GOLD: 25,
  ENEMY_HP: 4,
  ENEMY_REWARD: 5,
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


export const ENEMY_STATS = {
  basic:    { hp: 4, speed: 50, reward: 3 },
  fast:     { hp: 3, speed: 80, reward: 5 },
  tank:     { hp: 15, speed: 30, reward: 7 },
  splitter: { hp: 4, speed: 45, reward: 5 },
  boss:     { hp: 70, speed: 30, reward: 25 },
  healer:   { hp: 3, speed: 60, reward: 5},
  plane:    { hp: 10, speed: 81, reward: 10}
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
  { id: 'kill200', label: 'Slay 200 Enemies', diamonds: 1 },
  { id: 'kill450', label: 'Slay 450 Enemies', diamonds: 1 },
  { id: 'kill750', label: 'Slay 750 Enemies', diamonds: 1 },
  { id: 'kill1000', label: 'Slay 1000 Enemies', diamonds: 1 },
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

// this is where tower upgrade images are
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

// bullet images
export const BULLET_IMAGES = {
  basic: 'assets/images/bullets/basic.png',
  splash: 'assets/images/bullets/splash.svg'
};

