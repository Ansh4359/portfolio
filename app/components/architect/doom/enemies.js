import { SW, SH, HALF_FOV, ENEMY_IMP, ENEMY_DEMON, ENEMY_CACODEMON } from "./state";
import { LEVEL, MAP_W, MAP_H } from "./map";
import { damagePlayer } from "./player";
import { playSound } from "./audio";

// ─── Enemy Type Definitions ─────────────────────────────
export const ENEMY_TYPES = {
  [ENEMY_IMP]: {
    color: [200, 60, 60],
    eyeColor: [255, 220, 50],
    hp: 3,
    speed: 0.025,
    attackRange: 1.5,
    attackDamage: 0.25,
    size: 0.5,
    points: 100,
  },
  [ENEMY_DEMON]: {
    color: [170, 35, 35],
    eyeColor: [255, 80, 80],
    hp: 5,
    speed: 0.04,
    attackRange: 1.2,
    attackDamage: 0.4,
    size: 0.6,
    points: 200,
  },
  [ENEMY_CACODEMON]: {
    color: [200, 140, 50],
    eyeColor: [255, 50, 50],
    hp: 8,
    speed: 0.015,
    attackRange: 8.0,
    attackDamage: 0,
    size: 0.7,
    points: 300,
    ranged: true,
    fireballRate: 90,
  },
};

function isWall(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (ix < 0 || ix >= MAP_W || iy < 0 || iy >= MAP_H) return true;
  return LEVEL[iy][ix] !== 0;
}

// ─── Enemy AI Update ────────────────────────────────────
export function updateEnemies(state, frameCount) {
  const p = state.player;

  for (const e of state.enemies) {
    if (!e.alive) {
      if (e.deathTimer > 0) e.deathTimer--;
      continue;
    }

    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    e.dist = dist;

    const def = ENEMY_TYPES[e.type];

    // Line of sight check (simple)
    const hasLOS = checkLineOfSight(e.x, e.y, p.x, p.y);

    if (!hasLOS) {
      // Wander if can't see player
      if (frameCount % 60 === 0) {
        const wa = Math.random() * Math.PI * 2;
        const nx = e.x + Math.cos(wa) * def.speed;
        const ny = e.y + Math.sin(wa) * def.speed;
        if (!isWall(nx, e.y)) e.x = nx;
        if (!isWall(e.x, ny)) e.y = ny;
      }
      continue;
    }

    // Ranged attack (cacodemon)
    if (def.ranged && dist < def.attackRange && dist > 2) {
      e.fireballTimer = (e.fireballTimer || 0) + 1;
      if (e.fireballTimer >= def.fireballRate) {
        e.fireballTimer = 0;
        const angle = Math.atan2(dy, dx);
        state.fireballs.push({
          x: e.x,
          y: e.y,
          dx: Math.cos(angle) * 0.08,
          dy: Math.sin(angle) * 0.08,
          life: 120,
        });
        playSound("fireball");
      }
    }

    // Melee attack
    if (dist < def.attackRange && !def.ranged) {
      damagePlayer(state, def.attackDamage);
      continue;
    }

    // Chase player
    if (dist > 0) {
      const speed = def.speed;
      const nx = e.x + (dx / dist) * speed;
      const ny = e.y + (dy / dist) * speed;

      // Avoid other enemies
      let blocked = false;
      for (const other of state.enemies) {
        if (other === e || !other.alive) continue;
        const odx = nx - other.x;
        const ody = ny - other.y;
        if (odx * odx + ody * ody < 0.3) {
          blocked = true;
          break;
        }
      }

      if (!blocked) {
        if (!isWall(nx, e.y)) e.x = nx;
        if (!isWall(e.x, ny)) e.y = ny;
      }
    }
  }
}

function checkLineOfSight(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.ceil(dist * 4);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    if (isWall(x, y)) return false;
  }
  return true;
}

// ─── Fireball Update ────────────────────────────────────
export function updateFireballs(state) {
  for (let i = state.fireballs.length - 1; i >= 0; i--) {
    const fb = state.fireballs[i];
    fb.x += fb.dx;
    fb.y += fb.dy;
    fb.life--;

    // Wall collision
    if (isWall(fb.x, fb.y) || fb.life <= 0) {
      state.fireballs.splice(i, 1);
      continue;
    }

    // Player collision
    const dx = fb.x - state.player.x;
    const dy = fb.y - state.player.y;
    if (dx * dx + dy * dy < 0.3) {
      damagePlayer(state, 10);
      state.fireballs.splice(i, 1);
    }
  }
}

// ─── Render Enemies ─────────────────────────────────────
export function renderEnemies(ctx, d, zbuf, state) {
  const p = state.player;

  const sorted = state.enemies
    .filter((e) => e.alive || (e.deathTimer && e.deathTimer > 0))
    .map((e) => {
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      return { ...e, sortDist: dx * dx + dy * dy };
    })
    .sort((a, b) => b.sortDist - a.sortDist);

  for (const e of sorted) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.3) continue;

    let angle = Math.atan2(dy, dx) - p.angle;
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;

    if (Math.abs(angle) > HALF_FOV + 0.3) continue;

    const def = ENEMY_TYPES[e.type];
    const screenX = Math.floor(SW / 2 + (angle / HALF_FOV) * (SW / 2) * -1);
    const baseSize = def.size;

    // Death animation: shrink
    let sizeMul = 1;
    let alphaMul = 1;
    if (!e.alive && e.deathTimer > 0) {
      sizeMul = e.deathTimer / 30;
      alphaMul = e.deathTimer / 30;
    }

    const spriteH = Math.floor(SH / dist * baseSize * sizeMul);
    const spriteW = Math.floor(spriteH * 0.8);

    const startX = Math.max(0, Math.floor(screenX - spriteW / 2));
    const endX = Math.min(SW - 1, Math.floor(screenX + spriteW / 2));
    const startY = Math.max(0, Math.floor((SH - spriteH) / 2));
    const endY = Math.min(SH - 1, Math.floor((SH + spriteH) / 2));

    const shade = Math.max(0.2, 1 - dist * 0.07) * alphaMul;

    for (let sx = startX; sx <= endX; sx++) {
      if (dist >= zbuf[sx]) continue;

      const texX = (sx - (screenX - spriteW / 2)) / spriteW;

      for (let sy = startY; sy <= endY; sy++) {
        const texY = (sy - (SH - spriteH) / 2) / spriteH;
        const cx = texX - 0.5;
        const cy = texY - 0.5;

        // Body shape
        const bodyR = 0.38;
        const headR = 0.2;
        const headY = -0.22;

        const bodyHit = cx * cx + cy * cy < bodyR * bodyR;
        const headHit = cx * cx + (cy - headY) * (cy - headY) < headR * headR;

        if (bodyHit || headHit) {
          const eyeL = Math.abs(cx + 0.1) < 0.04 && Math.abs(cy - headY - 0.02) < 0.05;
          const eyeR = Math.abs(cx - 0.1) < 0.04 && Math.abs(cy - headY - 0.02) < 0.05;

          const i = (sy * SW + sx) * 4;

          if (eyeL || eyeR) {
            d[i] = Math.floor(def.eyeColor[0] * shade);
            d[i + 1] = Math.floor(def.eyeColor[1] * shade);
            d[i + 2] = Math.floor(def.eyeColor[2] * shade);
          } else {
            // Damage flash: white
            const flash = (e.flashTimer || 0) > 0 ? 1.5 : 1;
            d[i] = Math.min(255, Math.floor(def.color[0] * shade * flash));
            d[i + 1] = Math.min(255, Math.floor(def.color[1] * shade * flash));
            d[i + 2] = Math.min(255, Math.floor(def.color[2] * shade * flash));
          }
        }
      }
    }
  }

  // ─── Render Fireballs ────────────────────────────────
  for (const fb of state.fireballs) {
    const fdx = fb.x - p.x;
    const fdy = fb.y - p.y;
    const fdist = Math.sqrt(fdx * fdx + fdy * fdy);
    if (fdist < 0.3) continue;

    let fangle = Math.atan2(fdy, fdx) - p.angle;
    while (fangle > Math.PI) fangle -= 2 * Math.PI;
    while (fangle < -Math.PI) fangle += 2 * Math.PI;

    if (Math.abs(fangle) > HALF_FOV + 0.3) continue;

    const fsx = Math.floor(SW / 2 + (fangle / HALF_FOV) * (SW / 2) * -1);
    const fsize = Math.floor(SH / fdist * 0.15);

    const pulse = 0.7 + Math.sin(Date.now() / 50) * 0.3;

    for (let dx = -fsize; dx <= fsize; dx++) {
      const px = fsx + dx;
      if (px < 0 || px >= SW || fdist >= zbuf[px]) continue;

      for (let dy = -fsize; dy <= fsize; dy++) {
        const py = SH / 2 + dy;
        if (py < 0 || py >= SH) continue;

        if (dx * dx + dy * dy <= fsize * fsize) {
          const i = (Math.floor(py) * SW + px) * 4;
          const shade = Math.max(0.3, 1 - fdist * 0.08) * pulse;
          d[i] = Math.floor(255 * shade);
          d[i + 1] = Math.floor(120 * shade);
          d[i + 2] = Math.floor(30 * shade);
        }
      }
    }
  }
}
