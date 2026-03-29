"use client";

import { useEffect, useRef } from "react";
import { C, monoFont } from "./theme";
import {
  SW, SH,
  PHASE_TITLE, PHASE_PLAY, PHASE_DEAD, PHASE_WIN,
  createInitialState,
} from "./doom/state";
import { ENEMY_SPAWNS, ITEM_SPAWNS } from "./doom/map";
import { ENEMY_TYPES } from "./doom/enemies";
import { updatePlayer } from "./doom/player";
import { renderScene } from "./doom/raycaster";
import { shoot, renderWeapon } from "./doom/weapons";
import { updateEnemies, updateFireballs, renderEnemies } from "./doom/enemies";
import { updateItems, renderItems } from "./doom/items";
import { renderHUD, renderMinimap, renderOverlay } from "./doom/hud";
import { initAudio, startAmbient, stopAmbient } from "./doom/audio";

export default function DoomGame({ onClose }) {
  const canvasRef = useRef(null);
  const keysRef = useRef({});
  const rafRef = useRef(null);
  const mouseRef = useRef({ dx: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const buf = ctx.createImageData(SW, SH);
    const zbuf = new Float64Array(SW);

    // ─── Init State ─────────────────────────────────────
    const state = createInitialState();

    // Spawn enemies
    state.enemies = ENEMY_SPAWNS.map((s) => ({
      x: s.x,
      y: s.y,
      type: s.type,
      alive: true,
      hp: ENEMY_TYPES[s.type].hp,
      dist: 0,
      deathTimer: 0,
      flashTimer: 0,
      fireballTimer: 0,
    }));
    state.totalEnemies = state.enemies.length;

    // Spawn items
    state.items = ITEM_SPAWNS.map((s) => ({
      x: s.x,
      y: s.y,
      type: s.type,
    }));

    // ─── Input ──────────────────────────────────────────
    const onKey = (e) => {
      keysRef.current[e.code] = e.type === "keydown";

      if (e.type !== "keydown") return;

      if (e.code === "Escape") {
        if (state.phase === PHASE_PLAY || state.phase === PHASE_DEAD) {
          document.exitPointerLock?.();
          stopAmbient();
          onClose();
        }
      }

      if (e.code === "Digit1" && state.player.weapons[0]) state.player.currentWeapon = 0;
      if (e.code === "Digit2" && state.player.weapons[1]) state.player.currentWeapon = 1;
      if (e.code === "Digit3" && state.player.weapons[2]) state.player.currentWeapon = 2;

      if (e.code === "Enter") {
        if (state.phase === PHASE_TITLE) {
          state.phase = PHASE_PLAY;
          canvas.requestPointerLock?.();
          initAudio();
          startAmbient();
        } else if (state.phase === PHASE_DEAD || state.phase === PHASE_WIN) {
          // Restart
          const fresh = createInitialState();
          state.phase = fresh.phase;
          state.player = fresh.player;
          state.enemies = ENEMY_SPAWNS.map((s) => ({
            x: s.x, y: s.y, type: s.type,
            alive: true, hp: ENEMY_TYPES[s.type].hp,
            dist: 0, deathTimer: 0, flashTimer: 0, fireballTimer: 0,
          }));
          state.items = ITEM_SPAWNS.map((s) => ({ x: s.x, y: s.y, type: s.type }));
          state.fireballs = [];
          state.totalEnemies = state.enemies.length;
          state.killCount = 0;
          state.score = 0;
          state.shootTimer = 0;
          state.hitFlash = 0;
          state.damageFlash = 0;
          canvas.requestPointerLock?.();
          startAmbient();
        }
      }
    };

    const onMouse = (e) => {
      if (document.pointerLockElement === canvas) {
        mouseRef.current.dx += e.movementX;
      }
    };

    const onClick = () => {
      if (state.phase === PHASE_PLAY) {
        if (document.pointerLockElement !== canvas) {
          canvas.requestPointerLock?.();
        } else {
          shoot(state);
        }
      } else if (state.phase === PHASE_TITLE) {
        state.phase = PHASE_PLAY;
        canvas.requestPointerLock?.();
        initAudio();
        startAmbient();
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("mousemove", onMouse);
    canvas.addEventListener("click", onClick);

    // ─── Game Loop ──────────────────────────────────────
    let frameCount = 0;

    function loop() {
      const keys = keysRef.current;
      frameCount++;

      if (state.phase === PHASE_PLAY) {
        updatePlayer(state, keys, mouseRef);
        updateEnemies(state, frameCount);
        updateFireballs(state);
        updateItems(state);

        // Space to shoot
        if (keys["Space"]) {
          if (!keys._spaceFired) {
            shoot(state);
            keys._spaceFired = true;
          }
        } else {
          keys._spaceFired = false;
        }
      }

      // ─── Render ──────────────────────────────────────
      if (state.phase === PHASE_PLAY || state.phase === PHASE_DEAD || state.phase === PHASE_WIN) {
        renderScene(ctx, buf, zbuf, state);
        renderEnemies(ctx, buf.data, zbuf, state);
        renderItems(ctx, buf.data, zbuf, state);
        ctx.putImageData(buf, 0, 0);
        renderWeapon(ctx, state);
        renderHUD(ctx, state);
        renderMinimap(ctx, state);

        if (state.phase === PHASE_DEAD) {
          stopAmbient();
          renderOverlay(ctx, "dead", state);
        }
        if (state.phase === PHASE_WIN) {
          stopAmbient();
          renderOverlay(ctx, "win", state);
        }
      } else if (state.phase === PHASE_TITLE) {
        renderScene(ctx, buf, zbuf, state);
        ctx.putImageData(buf, 0, 0);
        renderWeapon(ctx, state);
        renderOverlay(ctx, "title", state);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("click", onClick);
      document.exitPointerLock?.();
      stopAmbient();
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        width={SW}
        height={SH}
        style={{
          imageRendering: "pixelated",
          width: "100%",
          maxWidth: 960,
          aspectRatio: `${SW}/${SH}`,
          cursor: "crosshair",
          borderRadius: 4,
        }}
      />
      <div
        style={{
          marginTop: 12,
          fontFamily: monoFont,
          fontSize: 10,
          color: C.outline,
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        WASD move · Mouse look · Click shoot  · ESC close
      </div>
    </div>
  );
}
