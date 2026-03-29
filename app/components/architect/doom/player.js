import {
  MOVE_SPEED, ROT_SPEED, MOUSE_SENS, PLAYER_RADIUS,
  HEAD_BOB_SPEED,
  W_PISTOL, W_SHOTGUN, W_CHAINGUN,
} from "./state";
import { LEVEL, MAP_W, MAP_H } from "./map";
import { playSound } from "./audio";

function isWall(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (ix < 0 || ix >= MAP_W || iy < 0 || iy >= MAP_H) return true;
  return LEVEL[iy][ix] !== 0;
}

export function updatePlayer(state, keys, mouseRef) {
  const p = state.player;

  // Mouse rotation
  if (mouseRef.current.dx !== 0) {
    p.angle += mouseRef.current.dx * MOUSE_SENS;
    mouseRef.current.dx = 0;
  }

  // Arrow rotation
  if (keys["ArrowLeft"]) p.angle -= ROT_SPEED;
  if (keys["ArrowRight"]) p.angle += ROT_SPEED;

  // Movement
  let mx = 0, my = 0;
  const cos = Math.cos(p.angle);
  const sin = Math.sin(p.angle);

  if (keys["KeyW"] || keys["ArrowUp"]) { mx += cos * MOVE_SPEED; my += sin * MOVE_SPEED; }
  if (keys["KeyS"] || keys["ArrowDown"]) { mx -= cos * MOVE_SPEED; my -= sin * MOVE_SPEED; }
  if (keys["KeyA"]) { mx += sin * MOVE_SPEED; my -= cos * MOVE_SPEED; }
  if (keys["KeyD"]) { mx -= sin * MOVE_SPEED; my += cos * MOVE_SPEED; }

  // Weapon switch
  if (keys["Digit1"] && p.weapons[W_PISTOL]) p.currentWeapon = W_PISTOL;
  if (keys["Digit2"] && p.weapons[W_SHOTGUN]) p.currentWeapon = W_SHOTGUN;
  if (keys["Digit3"] && p.weapons[W_CHAINGUN]) p.currentWeapon = W_CHAINGUN;

  // Collision detection with player radius
  const r = PLAYER_RADIUS;
  const nx = p.x + mx;
  const ny = p.y + my;

  if (!isWall(nx + r, p.y) && !isWall(nx - r, p.y) &&
      !isWall(nx + r, p.y + r) && !isWall(nx - r, p.y - r)) {
    p.x = nx;
  }
  if (!isWall(p.x + r, ny) && !isWall(p.x - r, ny) &&
      !isWall(p.x + r, ny + r) && !isWall(p.x - r, ny - r)) {
    p.y = ny;
  }

  // Head bob
  const moving = mx !== 0 || my !== 0;
  p.isMoving = moving;
  if (moving) {
    p.headBob += HEAD_BOB_SPEED * 0.016;
  } else {
    p.headBob *= 0.9;
  }

  // Timers
  if (state.shootTimer > 0) state.shootTimer--;
  if (state.hitFlash > 0) state.hitFlash--;
  if (state.damageFlash > 0) state.damageFlash--;
}

export function damagePlayer(state, amount) {
  state.player.health -= amount;
  state.damageFlash = 8;
  playSound("player_hurt");
  if (state.player.health <= 0) {
    state.player.health = 0;
    state.phase = "dead";
  }
}
