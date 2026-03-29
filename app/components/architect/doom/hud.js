import { SW, SH } from "./state";
import { LEVEL, MAP_W, MAP_H } from "./map";
import { WEAPONS } from "./weapons";

// ─── HUD Render ─────────────────────────────────────────
export function renderHUD(ctx, state) {
  const p = state.player;

  // Bottom bar
  ctx.fillStyle = "rgba(10,15,20,0.9)";
  ctx.fillRect(0, SH - 44, SW, 44);
  ctx.fillStyle = "#424753";
  ctx.fillRect(0, SH - 44, SW, 1);

  // ─── Health Face ─────────────────────────────────────
  const faceSize = 28;
  const faceX = 20;
  const faceY = SH - 28;
  ctx.fillStyle = "#252a30";
  ctx.fillRect(faceX - 2, faceY - 2, faceSize + 4, faceSize + 4);

  // Face expression changes with health
  const hpPct = p.health / 100;
  ctx.fillStyle = hpPct > 0.5 ? "#dda060" : hpPct > 0.25 ? "#cc8040" : "#aa4030";
  ctx.fillRect(faceX, faceY, faceSize, faceSize);

  // Eyes
  const eyeY = faceY + 8;
  ctx.fillStyle = "#fff";
  ctx.fillRect(faceX + 6, eyeY, 6, 6);
  ctx.fillRect(faceX + 16, eyeY, 6, 6);
  ctx.fillStyle = "#111";
  ctx.fillRect(faceX + 8, eyeY + 1, 3, 4);
  ctx.fillRect(faceX + 18, eyeY + 1, 3, 4);

  // Mouth — expression based on health
  ctx.fillStyle = "#111";
  if (hpPct > 0.7) {
    // Grin
    ctx.fillRect(faceX + 8, faceY + 19, 12, 3);
    ctx.fillRect(faceX + 7, faceY + 18, 2, 2);
    ctx.fillRect(faceX + 19, faceY + 18, 2, 2);
  } else if (hpPct > 0.3) {
    // Neutral
    ctx.fillRect(faceX + 9, faceY + 20, 10, 2);
  } else {
    // Grimace with blood
    ctx.fillStyle = "#cc3030";
    ctx.fillRect(faceX + 6, faceY + 16, 4, 6);
    ctx.fillStyle = "#111";
    ctx.fillRect(faceX + 9, faceY + 19, 10, 3);
  }

  // Health bar
  ctx.fillStyle = "#8c909f";
  ctx.font = "10px monospace";
  ctx.textAlign = "left";
  ctx.fillText("HEALTH", faceX + faceSize + 12, SH - 28);

  ctx.fillStyle = "#252a30";
  ctx.fillRect(faceX + faceSize + 12, SH - 22, 120, 10);

  const hpColor = p.health > 50 ? "#31e192" : p.health > 25 ? "#ffb300" : "#ff4444";
  ctx.fillStyle = hpColor;
  ctx.fillRect(faceX + faceSize + 12, SH - 22, Math.max(0, p.health * 1.2), 10);

  // Health text
  ctx.fillStyle = "#fff";
  ctx.font = "bold 8px monospace";
  ctx.fillText(`${Math.floor(p.health)}%`, faceX + faceSize + 14, SH - 14);

  // ─── Weapon Slots ────────────────────────────────────
  const slotsX = SW / 2 - 60;
  for (let i = 0; i < 3; i++) {
    const sx = slotsX + i * 40;
    const active = p.currentWeapon === i;
    const unlocked = p.weapons[i];

    ctx.fillStyle = active ? "rgba(173,198,255,0.2)" : "rgba(30,35,42,0.8)";
    ctx.fillRect(sx, SH - 40, 36, 36);
    ctx.strokeStyle = active ? "#adc6ff" : unlocked ? "#424753" : "#2a2f36";
    ctx.lineWidth = active ? 2 : 1;
    ctx.strokeRect(sx, SH - 40, 36, 36);

    ctx.fillStyle = active ? "#adc6ff" : unlocked ? "#8c909f" : "#3a3f47";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${i + 1}`, sx + 18, SH - 26);
    ctx.font = "8px monospace";
    ctx.fillText(WEAPONS[i].name.slice(0, 4), sx + 18, SH - 14);
  }
  ctx.textAlign = "left";

  // ─── Ammo ────────────────────────────────────────────
  const w = WEAPONS[p.currentWeapon];
  ctx.textAlign = "right";
  ctx.fillStyle = "#8c909f";
  ctx.font = "10px monospace";
  ctx.fillText(w.ammoType.toUpperCase(), SW - 16, SH - 28);

  ctx.fillStyle = p.ammo[w.ammoType] > 10 ? "#dee3eb" : "#ff4444";
  ctx.font = "bold 18px monospace";
  ctx.fillText(`${p.ammo[w.ammoType]}`, SW - 16, SH - 12);
  ctx.textAlign = "left";

  // ─── Score + Kills ───────────────────────────────────
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffd700";
  ctx.font = "10px monospace";
  ctx.fillText(`SCORE: ${state.score}`, SW / 2, 14);
  ctx.fillStyle = "#8c909f";
  ctx.fillText(`KILLS: ${state.killCount}/${state.totalEnemies}`, SW / 2, 28);
  ctx.textAlign = "left";
}

// ─── Minimap ────────────────────────────────────────────
export function renderMinimap(ctx, state) {
  const scale = 4;
  const ox = 10;
  const oy = 40;

  ctx.globalAlpha = 0.65;

  // Background
  ctx.fillStyle = "#0a0f14";
  ctx.fillRect(ox - 1, oy - 1, MAP_W * scale + 2, MAP_H * scale + 2);

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (LEVEL[y][x] > 0) {
        ctx.fillStyle = "#424753";
        ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
      }
    }
  }

  // Items
  for (const item of state.items) {
    ctx.fillStyle = "#31e192";
    ctx.fillRect(ox + item.x * scale - 1, oy + item.y * scale - 1, 2, 2);
  }

  // Enemies
  for (const e of state.enemies) {
    if (!e.alive) continue;
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(ox + e.x * scale - 1, oy + e.y * scale - 1, 2, 2);
  }

  // Player
  const p = state.player;
  ctx.fillStyle = "#adc6ff";
  ctx.fillRect(ox + p.x * scale - 2, oy + p.y * scale - 2, 4, 4);

  // Direction
  ctx.strokeStyle = "#adc6ff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ox + p.x * scale, oy + p.y * scale);
  ctx.lineTo(
    ox + (p.x + Math.cos(p.angle) * 2) * scale,
    oy + (p.y + Math.sin(p.angle) * 2) * scale
  );
  ctx.stroke();

  ctx.globalAlpha = 1;
}

// ─── Overlay Screens ────────────────────────────────────
export function renderOverlay(ctx, type, state) {
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(0, 0, SW, SH);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (type === "title") {
    // Title
    ctx.fillStyle = "#ff4444";
    ctx.font = "bold 42px monospace";
    ctx.fillText("PORTFOLIO", SW / 2, SH / 2 - 60);

    ctx.fillStyle = "#adc6ff";
    ctx.font = "bold 52px monospace";
    ctx.fillText("DOOM", SW / 2, SH / 2);

    // Subtitle
    ctx.fillStyle = "#c2c6d6";
    ctx.font = "12px monospace";
    ctx.fillText("A RAYCASTING EXPERIENCE", SW / 2, SH / 2 + 35);

    ctx.fillStyle = "#8c909f";
    ctx.font = "11px monospace";
    ctx.fillText("PRESS ENTER OR CLICK TO START", SW / 2, SH / 2 + 65);

    // Controls hint
    ctx.fillStyle = "#424753";
    ctx.font = "10px monospace";
    ctx.fillText("WASD move · Mouse look · Click shoot · 1/2/3 weapons", SW / 2, SH / 2 + 95);
  } else if (type === "dead") {
    ctx.fillStyle = "#ff4444";
    ctx.font = "bold 48px monospace";
    ctx.fillText("YOU DIED", SW / 2, SH / 2 - 20);

    ctx.fillStyle = "#8c909f";
    ctx.font = "14px monospace";
    ctx.fillText(`SCORE: ${state.score}  |  KILLS: ${state.killCount}/${state.totalEnemies}`, SW / 2, SH / 2 + 20);

    ctx.fillStyle = "#c2c6d6";
    ctx.font = "12px monospace";
    ctx.fillText("PRESS ENTER TO RESTART", SW / 2, SH / 2 + 55);
  } else if (type === "win") {
    ctx.fillStyle = "#31e192";
    ctx.font = "bold 48px monospace";
    ctx.fillText("LEVEL CLEAR", SW / 2, SH / 2 - 20);

    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 20px monospace";
    ctx.fillText(`FINAL SCORE: ${state.score}`, SW / 2, SH / 2 + 20);

    ctx.fillStyle = "#8c909f";
    ctx.font = "14px monospace";
    ctx.fillText(`ALL ${state.totalEnemies} ENEMIES ELIMINATED`, SW / 2, SH / 2 + 50);

    ctx.fillStyle = "#c2c6d6";
    ctx.font = "12px monospace";
    ctx.fillText("PRESS ENTER TO PLAY AGAIN", SW / 2, SH / 2 + 80);
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}
