/**
 * Generates short arcade-minimal SFX as 44.1kHz mono 16-bit WAV files.
 * Run: node scripts/generate-sfx.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../assets/sounds');
const SAMPLE_RATE = 44100;

function writeWav(name, samples) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  writeFileSync(join(OUT_DIR, name), buffer);
}

function env(t, attack, decay) {
  if (t < attack) return t / attack;
  const d = (t - attack) / decay;
  return Math.max(0, 1 - d);
}

function tone(freq, duration, attack = 0.005, decay = duration, vol = 0.5) {
  const len = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env(t, attack, decay) * vol;
  }
  return samples;
}

function noise(duration, attack = 0.002, decay = duration, vol = 0.4) {
  const len = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    samples[i] = (Math.random() * 2 - 1) * env(t, attack, decay) * vol;
  }
  return samples;
}

function mix(parts) {
  const maxLen = Math.max(...parts.map((p) => p.length));
  const out = new Float64Array(maxLen);
  for (const part of parts) {
    for (let i = 0; i < part.length; i++) out[i] += part[i];
  }
  return out;
}

function kick() {
  const thwack = noise(0.08, 0.001, 0.06, 0.55);
  const body = tone(180, 0.12, 0.002, 0.1, 0.35);
  return mix([thwack, body]);
}

function save() {
  const tap = tone(920, 0.06, 0.001, 0.04, 0.45);
  const metal = tone(2400, 0.05, 0.001, 0.03, 0.2);
  return mix([tap, metal]);
}

function goal() {
  const notes = [523, 659, 784, 1047];
  const parts = notes.map((f, i) => {
    const offset = Math.floor(i * 0.07 * SAMPLE_RATE);
    const note = tone(f, 0.18, 0.005, 0.15, 0.28);
    const padded = new Float64Array(offset + note.length);
    for (let j = 0; j < note.length; j++) padded[offset + j] = note[j];
    return padded;
  });
  const cheer = noise(0.35, 0.02, 0.3, 0.12);
  const cheerOffset = Math.floor(0.12 * SAMPLE_RATE);
  const cheerPadded = new Float64Array(cheerOffset + cheer.length);
  for (let j = 0; j < cheer.length; j++) cheerPadded[cheerOffset + j] = cheer[j];
  return mix([...parts, cheerPadded]);
}

function goalAgainst() {
  const low = tone(220, 0.25, 0.01, 0.22, 0.4);
  const drop = tone(140, 0.3, 0.15, 0.2, 0.35);
  const dropOffset = Math.floor(0.08 * SAMPLE_RATE);
  const dropPadded = new Float64Array(dropOffset + drop.length);
  for (let j = 0; j < drop.length; j++) dropPadded[dropOffset + j] = drop[j];
  return mix([low, dropPadded]);
}

function uiTap() {
  return tone(880, 0.05, 0.001, 0.04, 0.35);
}

function wall() {
  return mix([tone(600, 0.04, 0.001, 0.03, 0.25), noise(0.03, 0.001, 0.025, 0.15)]);
}

function win() {
  const notes = [392, 523, 659, 784, 988];
  const parts = notes.map((f, i) => {
    const offset = Math.floor(i * 0.09 * SAMPLE_RATE);
    const note = tone(f, 0.22, 0.005, 0.18, 0.3);
    const padded = new Float64Array(offset + note.length);
    for (let j = 0; j < note.length; j++) padded[offset + j] = note[j];
    return padded;
  });
  return mix(parts);
}

function lose() {
  const notes = [392, 349, 311, 262];
  const parts = notes.map((f, i) => {
    const offset = Math.floor(i * 0.12 * SAMPLE_RATE);
    const note = tone(f, 0.28, 0.01, 0.22, 0.32);
    const padded = new Float64Array(offset + note.length);
    for (let j = 0; j < note.length; j++) padded[offset + j] = note[j];
    return padded;
  });
  return mix(parts);
}

function superShot() {
  const boost = tone(440, 0.15, 0.005, 0.12, 0.35);
  return mix([kick(), boost]);
}

mkdirSync(OUT_DIR, { recursive: true });

const files = {
  kick: kick(),
  save: save(),
  goal: goal(),
  goal_against: goalAgainst(),
  ui_tap: uiTap(),
  wall: wall(),
  win: win(),
  lose: lose(),
  super: superShot(),
};

for (const [name, samples] of Object.entries(files)) {
  writeWav(`${name}.wav`, samples);
  console.log(`wrote ${name}.wav`);
}
