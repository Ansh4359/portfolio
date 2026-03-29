import { SW, SH, W_PISTOL, W_SHOTGUN } from "./state";
import { LEVEL, MAP_W, MAP_H } from "./map";
import { playSound } from "./audio";

// ─── Weapon Definitions ─────────────────────────────────
export const WEAPONS = [
  {
    name: "PISTOL",
    fireRate: 12,
    damage: 1,
    spread: 0,
    pellets: 1,
    ammoType: "bullets",
    ammoPerShot: 1,
    maxAmmo: 200,
  },
  {
    name: "SHOTGUN",
    fireRate: 25,
    damage: 1,
    spread: 0.14,
    pellets: 5,
    ammoType: "shells",
    ammoPerShot: 1,
    maxAmmo: 50,
  },
  {
    name: "CHAINGUN",
    fireRate: 5,
    damage: 1,
    spread: 0.035,
    pellets: 1,
    ammoType: "bullets",
    ammoPerShot: 1,
    maxAmmo: 400,
  },
];

function isWall(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (ix < 0 || ix >= MAP_W || iy < 0 || iy >= MAP_H) return true;
  return LEVEL[iy][ix] !== 0;
}

export function shoot(state) {
  const p = state.player;
  const w = WEAPONS[p.currentWeapon];

  if (state.shootTimer > 0) return;
  if (p.ammo[w.ammoType] < w.ammoPerShot) return;

  p.ammo[w.ammoType] -= w.ammoPerShot;
  state.shootTimer = w.fireRate;

  // Sound
  if (p.currentWeapon === W_PISTOL) playSound("pistol");
  else if (p.currentWeapon === W_SHOTGUN) playSound("shotgun");
  else playSound("chaingun");

  // Fire pellets
  for (let pellet = 0; pellet < w.pellets; pellet++) {
    const spreadAngle = (Math.random() - 0.5) * w.spread;
    const angle = p.angle + spreadAngle;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    for (let t = 0; t < 20; t += 0.1) {
      const rx = p.x + cos * t;
      const ry = p.y + sin * t;
      if (isWall(rx, ry)) break;

      for (const e of state.enemies) {
        if (!e.alive) continue;
        const dx = rx - e.x;
        const dy = ry - e.y;
        if (dx * dx + dy * dy < 0.3) {
          e.hp -= w.damage;
          state.hitFlash = 6;
          playSound("enemy_hurt");
          if (e.hp <= 0) {
            e.alive = false;
            e.deathTimer = 30;
            state.killCount++;
            state.score += e.type === "cacodemon" ? 300 : e.type === "demon" ? 200 : 100;
            playSound("enemy_death");
            if (state.killCount >= state.totalEnemies) {
              state.phase = "win";
            }
          }
          return; // hit something, stop this pellet
        }
      }
    }
  }
}

// ─── Weapon Rendering ──────────────────────────────────
export function renderWeapon(ctx, state) {
  const p = state.player;
  const recoil = state.shootTimer > (WEAPONS[p.currentWeapon].fireRate * 0.5)
    ? (state.shootTimer - WEAPONS[p.currentWeapon].fireRate * 0.5) * 3
    : 0;

  // Weapon bob
  const bobX = p.isMoving ? Math.sin(p.headBob * 2) * 4 : 0;
  const bobY = p.isMoving ? Math.abs(Math.cos(p.headBob * 2)) * 3 : 0;

  ctx.save();
  ctx.translate(SW / 2 + bobX, SH + 30 + recoil + bobY);

  if (p.currentWeapon === W_PISTOL) {
    drawPistol(ctx, state);
  } else if (p.currentWeapon === W_SHOTGUN) {
    drawShotgun(ctx, state);
  } else {
    drawChaingun(ctx, state);
  }

  ctx.restore();
}

function drawPistol(ctx, state) {
  // Barrel
  ctx.fillStyle = "#3a3f47";
  ctx.fillRect(-6, -130, 12, 70);
  // Slide
  ctx.fillStyle = "#2d3238";
  ctx.fillRect(-8, -130, 16, 15);
  // Body
  ctx.fillStyle = "#252a30";
  ctx.fillRect(-16, -65, 32, 40);
  // Grip
  ctx.fillStyle = "#1b2026";
  ctx.beginPath();
  ctx.moveTo(-12, -25);
  ctx.lineTo(-16, 30);
  ctx.lineTo(16, 30);
  ctx.lineTo(12, -25);
  ctx.fill();
  // Trigger guard
  ctx.strokeStyle = "#30353b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -20, 8, 0, Math.PI);
  ctx.stroke();
  // Muzzle flash
  if (state.shootTimer > 8) {
    const a = (state.shootTimer - 8) / 4;
    ctx.fillStyle = `rgba(255,200,50,${a})`;
    ctx.beginPath();
    ctx.moveTo(-10, -135);
    ctx.lineTo(0, -160);
    ctx.lineTo(10, -135);
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,200,${a * 0.5})`;
    ctx.beginPath();
    ctx.arc(0, -145, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShotgun(ctx, state) {
  // Double barrels
  ctx.fillStyle = "#3a3f47";
  ctx.fillRect(-10, -150, 8, 90);
  ctx.fillRect(2, -150, 8, 90);
  // Barrel housing
  ctx.fillStyle = "#2d3238";
  ctx.fillRect(-12, -150, 24, 10);
  // Pump
  ctx.fillStyle = "#4a3020";
  ctx.fillRect(-12, -80, 24, 20);
  // Body
  ctx.fillStyle = "#252a30";
  ctx.fillRect(-18, -65, 36, 45);
  // Grip
  ctx.fillStyle = "#3a2a1a";
  ctx.beginPath();
  ctx.moveTo(-14, -20);
  ctx.lineTo(-18, 35);
  ctx.lineTo(18, 35);
  ctx.lineTo(14, -20);
  ctx.fill();
  // Muzzle flash
  if (state.shootTimer > 18) {
    const a = (state.shootTimer - 18) / 7;
    ctx.fillStyle = `rgba(255,180,50,${a})`;
    ctx.beginPath();
    ctx.moveTo(-16, -155);
    ctx.lineTo(0, -190);
    ctx.lineTo(16, -155);
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,150,${a * 0.4})`;
    ctx.beginPath();
    ctx.arc(0, -165, 18, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawChaingun(ctx, state) {
  const spin = (Date.now() / 50) % (Math.PI * 2);
  // Rotating barrels
  for (let i = 0; i < 4; i++) {
    const a = spin + (i * Math.PI / 2);
    const bx = Math.cos(a) * 6;
    const by = Math.sin(a) * 6;
    ctx.fillStyle = "#4a4f57";
    ctx.fillRect(bx - 3, -150 + by * 0.3, 6, 90);
  }
  // Barrel housing
  ctx.fillStyle = "#2d3238";
  ctx.beginPath();
  ctx.arc(0, -60, 14, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.fillStyle = "#252a30";
  ctx.fillRect(-20, -65, 40, 50);
  // Ammo belt
  ctx.fillStyle = "#8a7a30";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(18, -50 + i * 10, 8, 7);
  }
  // Grip
  ctx.fillStyle = "#1b2026";
  ctx.beginPath();
  ctx.moveTo(-14, -15);
  ctx.lineTo(-18, 35);
  ctx.lineTo(18, 35);
  ctx.lineTo(14, -15);
  ctx.fill();
  // Muzzle flash
  if (state.shootTimer > 3) {
    const a = (state.shootTimer - 3) / 2;
    ctx.fillStyle = `rgba(255,220,80,${a})`;
    ctx.beginPath();
    ctx.moveTo(-8, -155);
    ctx.lineTo(0, -175);
    ctx.lineTo(8, -155);
    ctx.fill();
  }
}
