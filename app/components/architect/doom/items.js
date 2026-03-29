import { SW, SH, HALF_FOV } from "./state";
import { playSound } from "./audio";

// ─── Item Definitions ───────────────────────────────────
export const ITEM_DEFS = {
  health: { color: [60, 200, 60], symbol: "+", size: 0.3 },
  ammo_bullets: { color: [200, 200, 50], symbol: "B", size: 0.25 },
  ammo_shells: { color: [200, 150, 50], symbol: "S", size: 0.25 },
  shotgun: { color: [200, 140, 60], symbol: "2", size: 0.35 },
  chaingun: { color: [60, 140, 200], symbol: "3", size: 0.35 },
};

function isWall(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (ix < 0 || ix >= MAP_W || iy < 0 || iy >= MAP_H) return true;
  return LEVEL[iy][ix] !== 0;
}

// ─── Item Pickup Check ──────────────────────────────────
export function updateItems(state) {
  const p = state.player;

  for (let i = state.items.length - 1; i >= 0; i--) {
    const item = state.items[i];
    const dx = p.x - item.x;
    const dy = p.y - item.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0.6) continue;

    let picked = false;

    switch (item.type) {
      case "health":
        if (p.health < 100) {
          p.health = Math.min(100, p.health + 25);
          picked = true;
        }
        break;
      case "ammo_bullets":
        if (p.ammo.bullets < 400) {
          p.ammo.bullets = Math.min(400, p.ammo.bullets + 20);
          picked = true;
        }
        break;
      case "ammo_shells":
        if (p.ammo.shells < 50) {
          p.ammo.shells = Math.min(50, p.ammo.shells + 8);
          picked = true;
        }
        break;
      case "shotgun":
        if (!p.weapons[1]) {
          p.weapons[1] = true;
          p.ammo.shells = Math.min(50, p.ammo.shells + 10);
          picked = true;
        }
        break;
      case "chaingun":
        if (!p.weapons[2]) {
          p.weapons[2] = true;
          p.ammo.bullets = Math.min(400, p.ammo.bullets + 50);
          picked = true;
        }
        break;
    }

    if (picked) {
      state.items.splice(i, 1);
      state.score += 50;
      playSound("pickup");
    }
  }
}

// ─── Render Items (Billboard) ───────────────────────────
export function renderItems(ctx, d, zbuf, state) {
  const p = state.player;

  const sorted = state.items
    .map((item) => {
      const dx = item.x - p.x;
      const dy = item.y - p.y;
      return { ...item, sortDist: dx * dx + dy * dy };
    })
    .sort((a, b) => b.sortDist - a.sortDist);

  for (const item of sorted) {
    const dx = item.x - p.x;
    const dy = item.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.3) continue;

    let angle = Math.atan2(dy, dx) - p.angle;
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;

    if (Math.abs(angle) > HALF_FOV + 0.3) continue;

    const def = ITEM_DEFS[item.type];
    const screenX = Math.floor(SW / 2 + (angle / HALF_FOV) * (SW / 2) * -1);

    // Floating animation
    const bob = Math.sin(Date.now() / 400 + item.x * 7) * 0.05;

    const spriteH = Math.floor(SH / dist * def.size);
    const spriteW = spriteH;

    const startX = Math.max(0, Math.floor(screenX - spriteW / 2));
    const endX = Math.min(SW - 1, Math.floor(screenX + spriteW / 2));
    const startY = Math.max(0, Math.floor((SH - spriteH) / 2 - bob * SH / dist));
    const endY = Math.min(SH - 1, Math.floor((SH + spriteH) / 2 - bob * SH / dist));

    const shade = Math.max(0.3, 1 - dist * 0.07);

    for (let sx = startX; sx <= endX; sx++) {
      if (dist >= zbuf[sx]) continue;

      const tx = (sx - (screenX - spriteW / 2)) / spriteW;

      for (let sy = startY; sy <= endY; sy++) {
        const ty = (sy - ((SH - spriteH) / 2 - bob * SH / dist)) / spriteH;
        const cx = tx - 0.5;
        const cy = ty - 0.5;

        // Diamond shape for items
        const diamond = Math.abs(cx) + Math.abs(cy) < 0.4;

        if (diamond) {
          const i = (sy * SW + sx) * 4;
          const pulse = 0.8 + Math.sin(Date.now() / 300 + item.x) * 0.2;
          d[i] = Math.floor(def.color[0] * shade * pulse);
          d[i + 1] = Math.floor(def.color[1] * shade * pulse);
          d[i + 2] = Math.floor(def.color[2] * shade * pulse);
        }
      }
    }
  }
}
