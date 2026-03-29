let audioCtx = null;
let ambientNode = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function initAudio() {
  try {
    getCtx();
  } catch {
    // Audio not available
  }
}

function noise(ctx, duration) {
  const len = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

export function playSound(type) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    switch (type) {
      case "pistol": {
        const src = ctx.createBufferSource();
        src.buffer = noise(ctx, 0.06);
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 2000;
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        src.connect(filter).connect(gain).connect(ctx.destination);
        src.start(now);
        src.stop(now + 0.06);

        // Low pop
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.15, now);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(g2).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case "shotgun": {
        const src = ctx.createBufferSource();
        src.buffer = noise(ctx, 0.12);
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1200;
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        src.connect(filter).connect(gain).connect(ctx.destination);
        src.start(now);
        src.stop(now + 0.12);

        // Bass thump
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.2, now);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(g2).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case "chaingun": {
        const src = ctx.createBufferSource();
        src.buffer = noise(ctx, 0.03);
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 3000;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        src.connect(filter).connect(gain).connect(ctx.destination);
        src.start(now);
        src.stop(now + 0.03);
        break;
      }

      case "enemy_hurt": {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100 + Math.random() * 50, now);
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 600;
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(filter).connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case "enemy_death": {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1000;
        osc.connect(filter).connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case "pickup": {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case "player_hurt": {
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.setValueAtTime(60, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case "fireball": {
        const src = ctx.createBufferSource();
        src.buffer = noise(ctx, 0.15);
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15);
        filter.Q.value = 2;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        src.connect(filter).connect(gain).connect(ctx.destination);
        src.start(now);
        src.stop(now + 0.15);
        break;
      }
    }
  } catch {
    // Audio not available
  }
}

export function startAmbient() {
  try {
    const ctx = getCtx();
    if (ambientNode) return;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 40;

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 42;

    const gain = ctx.createGain();
    gain.gain.value = 0.03;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 100;

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(ctx.destination);

    osc.start();
    osc2.start();
    ambientNode = { osc, osc2, gain };
  } catch {
    // Audio not available
  }
}

export function stopAmbient() {
  if (ambientNode) {
    try {
      ambientNode.osc.stop();
      ambientNode.osc2.stop();
    } catch {
      // Already stopped
    }
    ambientNode = null;
  }
}
