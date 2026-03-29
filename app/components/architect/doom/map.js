import {
  ITEM_HEALTH, ITEM_AMMO_BULLETS, ITEM_AMMO_SHELLS,
  ITEM_SHOTGUN, ITEM_CHAINGUN,
  ENEMY_IMP, ENEMY_DEMON, ENEMY_CACODEMON,
} from "./state";

// ─── Level Data (32x32) ─────────────────────────────────
// 0 = empty, 1 = brick, 2 = stone, 3 = metal, 4 = tech, 5 = secret wall
export const LEVEL = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,0,0,2,2,2,2,0,0,0,1,1,1,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,2,0,0,0,0,0,1,0,1,0,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,4,4,4,4,4,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,2],
  [2,2,2,2,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,4,4,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,0,0,2,2,2,0,0,1,0,0,0,1,0,0,3,3,3,3,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,1,0,0,3,0,0,3,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,2,0,0,1,1,0,1,1,0,0,3,0,0,3,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,2],
  [2,2,2,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2],
  [2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,4,4,5,4,4,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

export const MAP_H = LEVEL.length;
export const MAP_W = LEVEL[0].length;

// ─── Wall Colors (fallback for untextured) ──────────────
export const WALL_COLORS = [
  [0, 0, 0],
  [140, 80, 70],     // 1: brick red
  [100, 105, 115],   // 2: stone gray
  [90, 110, 130],    // 3: metal blue
  [70, 130, 90],     // 4: tech green
  [100, 105, 115],   // 5: secret (stone look)
];

// ─── Enemy Spawns ───────────────────────────────────────
export const ENEMY_SPAWNS = [
  { x: 7.5, y: 1.5, type: ENEMY_IMP },
  { x: 7.5, y: 4.5, type: ENEMY_IMP },
  { x: 14.5, y: 7.5, type: ENEMY_IMP },
  { x: 20.5, y: 7.5, type: ENEMY_IMP },
  { x: 15.5, y: 15.5, type: ENEMY_DEMON },
  { x: 22.5, y: 17.5, type: ENEMY_IMP },
  { x: 4.5, y: 22.5, type: ENEMY_IMP },
  { x: 11.5, y: 27.5, type: ENEMY_CACODEMON },
  { x: 25.5, y: 2.5, type: ENEMY_IMP },
  { x: 25.5, y: 9.5, type: ENEMY_DEMON },
  { x: 22.5, y: 27.5, type: ENEMY_IMP },
  { x: 28.5, y: 23.5, type: ENEMY_DEMON },
];

// ─── Item Spawns ────────────────────────────────────────
export const ITEM_SPAWNS = [
  { x: 3.5, y: 8.5, type: ITEM_HEALTH },
  { x: 11.5, y: 2.5, type: ITEM_AMMO_BULLETS },
  { x: 19.5, y: 2.5, type: ITEM_AMMO_BULLETS },
  { x: 8.5, y: 12.5, type: ITEM_HEALTH },
  { x: 15.5, y: 14.5, type: ITEM_AMMO_SHELLS },
  { x: 21.5, y: 18.5, type: ITEM_AMMO_BULLETS },
  { x: 4.5, y: 17.5, type: ITEM_HEALTH },
  { x: 3.5, y: 24.5, type: ITEM_AMMO_BULLETS },
  { x: 15.5, y: 24.5, type: ITEM_HEALTH },
  { x: 28.5, y: 8.5, type: ITEM_SHOTGUN },
  { x: 11.5, y: 27.5, type: ITEM_CHAINGUN },
  { x: 26.5, y: 25.5, type: ITEM_AMMO_SHELLS },
  { x: 17.5, y: 7.5, type: ITEM_AMMO_BULLETS },
  { x: 8.5, y: 28.5, type: ITEM_HEALTH },
];

// ─── Procedural Texture Generation ─────────────────────
const TEX_SIZE = 64;

function noise(x, y, seed) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function generateBrickTexture() {
  const data = new Uint8ClampedArray(TEX_SIZE * TEX_SIZE * 4);
  const seed = Math.random() * 1000;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const brickH = 8;
      const brickW = 16;
      const row = Math.floor(y / brickH);
      const offset = (row % 2) * (brickW / 2);
      const bx = (x + offset) % brickW;
      const by = y % brickH;

      const isMortar = bx === 0 || by === 0;

      if (isMortar) {
        const n = noise(x, y, seed) * 20;
        data[i] = 80 + n;
        data[i + 1] = 75 + n;
        data[i + 2] = 70 + n;
      } else {
        const n = noise(x, y, seed + 1) * 30;
        const n2 = noise(x * 0.5, y * 0.5, seed + 2) * 15;
        data[i] = 140 + n + n2;
        data[i + 1] = 65 + n * 0.5 + n2;
        data[i + 2] = 55 + n * 0.3 + n2;
      }
      data[i + 3] = 255;
    }
  }
  return data;
}

function generateStoneTexture() {
  const data = new Uint8ClampedArray(TEX_SIZE * TEX_SIZE * 4);
  const seed = Math.random() * 1000;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const n = noise(x, y, seed) * 25;
      const n2 = noise(x * 0.3, y * 0.3, seed + 5) * 15;
      const crack = (noise(x * 2, y * 0.5, seed + 10) > 0.92) ? -30 : 0;

        data[i] = Math.max(0, 100 + n + n2 + crack);
        data[i + 1] = Math.max(0, 105 + n + n2 + crack);
        data[i + 2] = Math.max(0, 115 + n + n2 + crack);
      data[i + 3] = 255;
    }
  }
  return data;
}

function generateMetalTexture() {
  const data = new Uint8ClampedArray(TEX_SIZE * TEX_SIZE * 4);
  const seed = Math.random() * 1000;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const isSeam = y % 16 === 0 || y % 16 === 1;
      const isRivet = (x % 16 < 3 && y % 16 < 3) || (x % 16 > 12 && y % 16 < 3);

      if (isSeam) {
        data[i] = 50;
        data[i + 1] = 55;
        data[i + 2] = 65;
      } else if (isRivet) {
        data[i] = 130;
        data[i + 1] = 140;
        data[i + 2] = 155;
      } else {
        const n = noise(x, y, seed) * 12;
        const stripe = (x % 16 < 8) ? 5 : -5;
        data[i] = 90 + n + stripe;
        data[i + 1] = 110 + n + stripe;
        data[i + 2] = 130 + n + stripe;
      }
      data[i + 3] = 255;
    }
  }
  return data;
}

function generateTechTexture() {
  const data = new Uint8ClampedArray(TEX_SIZE * TEX_SIZE * 4);
  const seed = Math.random() * 1000;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const isCircuit = (x % 8 === 0 || y % 8 === 0) && noise(x, y, seed) > 0.3;
      const isGlow = isCircuit && noise(x * 0.5, y * 0.5, seed + 3) > 0.5;
      const isPad = x % 16 < 4 && y % 16 < 4;

      if (isGlow) {
        data[i] = 50;
        data[i + 1] = 200;
        data[i + 2] = 120;
      } else if (isCircuit) {
        data[i] = 40;
        data[i + 1] = 80;
        data[i + 2] = 55;
      } else if (isPad) {
        data[i] = 60;
        data[i + 1] = 70;
        data[i + 2] = 65;
      } else {
        const n = noise(x, y, seed + 1) * 10;
        data[i] = 25 + n;
        data[i + 1] = 45 + n;
        data[i + 2] = 35 + n;
      }
      data[i + 3] = 255;
    }
  }
  return data;
}

// ─── Generate All Textures ──────────────────────────────
let textures = null;

export function generateTextures() {
  textures = {
    1: generateBrickTexture(),
    2: generateStoneTexture(),
    3: generateMetalTexture(),
    4: generateTechTexture(),
    5: generateStoneTexture(), // secret wall looks like stone
  };
  return textures;
}

export function getTexture(wallType) {
  if (!textures) generateTextures();
  return textures[wallType] || textures[1];
}

// ─── Floor Texture ──────────────────────────────────────
let floorTexture = null;

export function generateFloorTexture() {
  const data = new Uint8ClampedArray(TEX_SIZE * TEX_SIZE * 4);
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const checker = ((Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0);
      const n = noise(x, y, 42) * 8;
      if (checker) {
        data[i] = 45 + n; data[i + 1] = 42 + n; data[i + 2] = 50 + n;
      } else {
        data[i] = 35 + n; data[i + 1] = 32 + n; data[i + 2] = 40 + n;
      }
      data[i + 3] = 255;
    }
  }
  floorTexture = data;
  return data;
}

export function getFloorTexture() {
  if (!floorTexture) generateFloorTexture();
  return floorTexture;
}

// ─── Ceiling Texture ────────────────────────────────────
let ceilingTexture = null;

export function generateCeilingTexture() {
  const data = new Uint8ClampedArray(TEX_SIZE * TEX_SIZE * 4);
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const n = noise(x, y, 99) * 6;
      data[i] = 20 + n; data[i + 1] = 22 + n; data[i + 2] = 28 + n;
      data[i + 3] = 255;
    }
  }
  ceilingTexture = data;
  return data;
}

export function getCeilingTexture() {
  if (!ceilingTexture) generateCeilingTexture();
  return ceilingTexture;
}
