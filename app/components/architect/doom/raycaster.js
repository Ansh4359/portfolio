import {
  SW, SH, FOV, HALF_FOV, HEAD_BOB_AMOUNT,
} from "./state";
import { LEVEL, MAP_W, MAP_H } from "./map";
import {
  getTexture, getFloorTexture, getCeilingTexture,
} from "./map";

const TEX_SIZE = 64;
const TEX_MASK = TEX_SIZE - 1;

export function renderScene(ctx, buf, zbuf, state) {
  const d = buf.data;
  const p = state.player;
  const bobOffset = Math.sin(p.headBob) * HEAD_BOB_AMOUNT * (p.isMoving ? 1 : 0);

  // ─── Floor & Ceiling (textured) ──────────────────────
  renderFloorCeiling(d, p, bobOffset);

  // ─── Raycast Walls (textured) ────────────────────────
  renderWalls(d, p, zbuf, bobOffset);

  // ─── Put pixel buffer ────────────────────────────────
  if (state.damageFlash > 0) {
    const intensity = state.damageFlash / 8;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, d[i] + Math.floor(120 * intensity));
      d[i + 1] = Math.floor(d[i + 1] * (1 - intensity * 0.5));
      d[i + 2] = Math.floor(d[i + 2] * (1 - intensity * 0.5));
    }
  }

  if (state.hitFlash > 0) {
    const intensity = state.hitFlash / 6;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, d[i] + Math.floor(60 * intensity));
      d[i + 1] = Math.min(255, d[i + 1] + Math.floor(60 * intensity));
      d[i + 2] = Math.min(255, d[i + 2] + Math.floor(60 * intensity));
    }
  }

  ctx.putImageData(buf, 0, 0);
}

// ─── Floor & Ceiling Casting ──────────────────────────
function renderFloorCeiling(d, p, bobOffset) {
  const floorTex = getFloorTexture();
  const ceilTex = getCeilingTexture();
  const halfH = SH / 2 + bobOffset;

  for (let y = 0; y < SH; y++) {
    const isFloor = y > halfH;
    const rowDist = isFloor
      ? (SH * 0.5) / (y - halfH)
      : (SH * 0.5) / (halfH - y);

    if (rowDist <= 0 || !isFinite(rowDist)) {
      for (let x = 0; x < SW; x++) {
        const i = (y * SW + x) * 4;
        d[i] = 15; d[i + 1] = 20; d[i + 2] = 25; d[i + 3] = 255;
      }
      continue;
    }

    const cosA = Math.cos(p.angle);
    const sinA = Math.sin(p.angle);
    const rayDirX0 = cosA - Math.sin(p.angle) * Math.tan(HALF_FOV);
    const rayDirY0 = sinA + Math.cos(p.angle) * Math.tan(HALF_FOV);
    const rayDirX1 = cosA + Math.sin(p.angle) * Math.tan(HALF_FOV);
    const rayDirY1 = sinA - Math.cos(p.angle) * Math.tan(HALF_FOV);

    const floorStepX = rowDist * (rayDirX1 - rayDirX0) / SW;
    const floorStepY = rowDist * (rayDirY1 - rayDirY0) / SW;

    let floorX = p.x + rowDist * rayDirX0;
    let floorY = p.y + rowDist * rayDirY0;

    const shade = Math.max(0.1, 1 - rowDist * 0.06);
    const tex = isFloor ? floorTex : ceilTex;

    for (let x = 0; x < SW; x++) {
      const tx = (Math.floor(floorX * TEX_SIZE) & TEX_MASK);
      const ty = (Math.floor(floorY * TEX_SIZE) & TEX_MASK);
      const ti = (ty * TEX_SIZE + tx) * 4;

      const i = (y * SW + x) * 4;
      d[i] = Math.floor(tex[ti] * shade);
      d[i + 1] = Math.floor(tex[ti + 1] * shade);
      d[i + 2] = Math.floor(tex[ti + 2] * shade);
      d[i + 3] = 255;

      floorX += floorStepX;
      floorY += floorStepY;
    }
  }
}

// ─── Textured Wall Rendering ──────────────────────────
function renderWalls(d, p, zbuf, bobOffset) {
  for (let col = 0; col < SW; col++) {
    const rayAngle = p.angle - HALF_FOV + (col / SW) * FOV;
    const dirX = Math.cos(rayAngle);
    const dirY = Math.sin(rayAngle);

    let mapX = Math.floor(p.x);
    let mapY = Math.floor(p.y);

    const deltaDistX = Math.abs(1 / (dirX || 1e-10));
    const deltaDistY = Math.abs(1 / (dirY || 1e-10));

    let stepX, stepY, sideDistX, sideDistY;

    if (dirX < 0) {
      stepX = -1;
      sideDistX = (p.x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - p.x) * deltaDistX;
    }
    if (dirY < 0) {
      stepY = -1;
      sideDistY = (p.y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - p.y) * deltaDistY;
    }

    let side = 0;
    let wallType = 1;
    let hit = false;

    while (!hit) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      if (mapX < 0 || mapX >= MAP_W || mapY < 0 || mapY >= MAP_H) break;
      if (LEVEL[mapY][mapX] > 0) {
        wallType = LEVEL[mapY][mapX];
        hit = true;
      }
    }

    let perpDist;
    let wallX; // where on the wall was hit (0-1)
    if (side === 0) {
      perpDist = (mapX - p.x + (1 - stepX) / 2) / dirX;
      wallX = p.y + perpDist * dirY;
    } else {
      perpDist = (mapY - p.y + (1 - stepY) / 2) / dirY;
      wallX = p.x + perpDist * dirX;
    }
    wallX -= Math.floor(wallX);

    const corrDist = perpDist * Math.cos(rayAngle - p.angle);
    zbuf[col] = corrDist;

    if (corrDist <= 0) continue;

    const lineH = Math.floor(SH / corrDist);
    const drawStart = Math.max(0, Math.floor((SH - lineH) / 2 + bobOffset));
    const drawEnd = Math.min(SH - 1, Math.floor((SH + lineH) / 2 + bobOffset));

    const tex = getTexture(wallType);
    const texX = Math.floor(wallX * TEX_SIZE) & TEX_MASK;
    const shade = Math.max(0.12, 1 - corrDist * 0.07) * (side === 1 ? 0.7 : 1.0);

    // Texture mapping
    const step = TEX_SIZE / lineH;
    let texPos = (drawStart - bobOffset - (SH - lineH) / 2) * step;

    for (let y = drawStart; y <= drawEnd; y++) {
      const texY = Math.floor(texPos) & TEX_MASK;
      texPos += step;

      const ti = (texY * TEX_SIZE + texX) * 4;
      const pi = (y * SW + col) * 4;

      d[pi] = Math.floor(tex[ti] * shade);
      d[pi + 1] = Math.floor(tex[ti + 1] * shade);
      d[pi + 2] = Math.floor(tex[ti + 2] * shade);
      d[pi + 3] = 255;
    }
  }
}
