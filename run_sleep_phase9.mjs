#!/usr/bin/env node

/**
 * QBLs – Phase 9
 * Entropy + Novelty Decay + Memory Penalties
 * Thomas Lee Harvey (author / architect)
 *
 * Simulation of symbolic cognition with
 * self-regulation, entropy pressure, and memory shaping
 */

import fs from "fs";
import path from "path";

// ---------------- CONFIG ----------------

const RUNTIME_HOURS = 3;
const TICK_INTERVAL_MS = 1000; // 1 second
const TOTAL_TICKS = RUNTIME_HOURS * 60 * 60;

const RECENT_WINDOW = 50;
const MEMORY_PENALTY_STRENGTH = 0.35;

const ENTROPY_DECAY = 0.9995;
const ENTROPY_MIN = 0.25;

// ---------------- SYMBOL SPACE ----------------

const SIGHTS = [
  "tree", "river", "mountain", "sky", "shadow", "light"
];

const SOUNDS = [
  "birds", "wind", "waterfall", "echo", "silence"
];

const THOUGHTS = [
  "Memory bends time",
  "I am observing myself",
  "Calm exists beneath chaos",
  "Patterns repeat quietly",
  "Meaning emerges naturally"
];

// ---------------- STATE ----------------

let tick = 0;
let entropy = 1.0;

const recentPercepts = [];
const memoryCounts = new Map();

// ---------------- LOGGING ----------------

const outDir = path.resolve("./output");
const logPath = path.join(outDir, "brain_log.jsonl");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(logPath, "");

// ---------------- UTILS ----------------

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function perceptKey(p) {
  return `${p.sight}|${p.sound}|${p.thought}`;
}

function noveltyScore(key) {
  const recentCount = recentPercepts.filter(k => k === key).length;
  return 1 / (1 + recentCount);
}

function memoryPenalty(key) {
  const count = memoryCounts.get(key) || 0;
  return Math.exp(-MEMORY_PENALTY_STRENGTH * count);
}

function weightedChoice(candidates) {
  const total = candidates.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of candidates) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return candidates[candidates.length - 1];
}

// ---------------- CORE LOOP ----------------

function step() {
  tick++;

  const candidates = [];

  for (const sight of SIGHTS) {
    for (const sound of SOUNDS) {
      for (const thought of THOUGHTS) {
        const percept = { sight, sound, thought };
        const key = perceptKey(percept);

        const novelty = noveltyScore(key);
        const penalty = memoryPenalty(key);

        const weight =
          novelty *
          penalty *
          entropy;

        candidates.push({ ...percept, key, weight });
      }
    }
  }

  const chosen = weightedChoice(candidates);

  // Update state
  recentPercepts.push(chosen.key);
  if (recentPercepts.length > RECENT_WINDOW) recentPercepts.shift();

  memoryCounts.set(
    chosen.key,
    (memoryCounts.get(chosen.key) || 0) + 1
  );

  entropy = Math.max(ENTROPY_MIN, entropy * ENTROPY_DECAY);

  const record = {
    tick,
    sight: chosen.sight,
    sound: chosen.sound,
    thought: chosen.thought,
    reward: 1,
    entropy: Number(entropy.toFixed(4))
  };

  fs.appendFileSync(logPath, JSON.stringify(record) + "\n");

  console.log("🧠", record);

  if (tick % 60 === 0) {
    console.log("🌙 Dream phase");
  }

  if (tick >= TOTAL_TICKS) {
    console.log("✅ Phase 9 complete");
    process.exit(0);
  }
}

// ---------------- RUN ----------------

console.log("🟢 Phase 9 starting");
console.log(`⏱ Runtime: ${RUNTIME_HOURS} hours`);

setInterval(step, TICK_INTERVAL_MS);
