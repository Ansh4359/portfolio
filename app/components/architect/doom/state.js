// ─── Display Constants ──────────────────────────────────
export const SW = 640;
export const SH = 400;
export const FOV = Math.PI / 3;
export const HALF_FOV = FOV / 2;

// ─── Movement ───────────────────────────────────────────
export const MOVE_SPEED = 0.055;
export const ROT_SPEED = 0.04;
export const MOUSE_SENS = 0.002;
export const PLAYER_RADIUS = 0.2;
export const HEAD_BOB_SPEED = 10;
export const HEAD_BOB_AMOUNT = 4;

// ─── Weapon IDs ─────────────────────────────────────────
export const W_PISTOL = 0;
export const W_SHOTGUN = 1;
export const W_CHAINGUN = 2;

// ─── Item Types ─────────────────────────────────────────
export const ITEM_HEALTH = "health";
export const ITEM_AMMO_BULLETS = "ammo_bullets";
export const ITEM_AMMO_SHELLS = "ammo_shells";
export const ITEM_SHOTGUN = "shotgun";
export const ITEM_CHAINGUN = "chaingun";

// ─── Enemy Types ────────────────────────────────────────
export const ENEMY_IMP = "imp";
export const ENEMY_DEMON = "demon";
export const ENEMY_CACODEMON = "cacodemon";

// ─── Game Phases ────────────────────────────────────────
export const PHASE_TITLE = "title";
export const PHASE_PLAY = "play";
export const PHASE_DEAD = "dead";
export const PHASE_WIN = "win";

// ─── Create Initial Game State ──────────────────────────
export function createInitialState() {
  return {
    phase: PHASE_TITLE,
    player: {
      x: 2.5,
      y: 2.5,
      angle: 0,
      health: 100,
      ammo: { bullets: 50, shells: 0 },
      weapons: [true, false, false], // pistol unlocked by default
      currentWeapon: W_PISTOL,
      headBob: 0,
      isMoving: false,
    },
    enemies: [],
    items: [],
    fireballs: [],
    shootTimer: 0,
    hitFlash: 0,
    damageFlash: 0,
    killCount: 0,
    totalEnemies: 0,
    score: 0,
    weaponBob: 0,
  };
}
