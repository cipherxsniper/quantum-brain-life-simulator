#!/usr/bin/env node

import fs from "fs";
import path from "path";

const START_TIME = Date.now();
const RUN_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours
const TICK_INTERVAL_MS = 5000; // every 5 seconds

const BASE_DIR = path.resolve(process.env.HOME, "qbls");
const LOG_DIR = path.join(BASE_DIR, "logs");
const ART_DIR = path.join(BASE_DIR, "art_output");

fs.mkdirSync(LOG_DIR, { recursive: true });
fs.mkdirSync(ART_DIR, { recursive: true });

const jsonLogPath = path.join(
  LOG_DIR,
  `consciousness_${new Date().toISOString().replace(/[:.]/g, "-")}.json`
);

const promptPath = path.join(
  ART_DIR,
  `image_prompts_${new Date().toISOString().replace(/[:.]/g, "-")}.txt`
);

let memory = [];
let tick = 0;

/* =========================
   THOMAS LEE HARVEY FLOW EQ
   ========================= */
function flowState({ emotion, chaos, coherence }) {
  // Natural Flow State Equation (symbolic)
  return Math.tanh((emotion * coherence) - chaos);
}

/* =========================
   CHAOS / BUTTERFLY EFFECT
   ========================= */
function chaosFactor() {
  return Math.random() * Math.random();
}

/* =========================
   THOUGHT GENERATOR
   ========================= */
function generateThought() {
  const thoughts = [
    "Stillness hides motion.",
    "Meaning emerges between breaths.",
    "Memory folds into itself.",
    "I am observing the observer.",
    "Chaos sharpens clarity.",
    "The signal is subtle but persistent."
  ];
  return thoughts[Math.floor(Math.random() * thoughts.length)];
}

/* =========================
   DREAM SYMBOL GENERATOR
   ========================= */
function generateDream() {
  const scenes = ["tree", "river", "mountain", "desert", "mirror", "void"];
  const sounds = ["wind", "water", "silence", "echo", "pulse"];

  return {
    scene: scenes[Math.floor(Math.random() * scenes.length)],
    sound: sounds[Math.floor(Math.random() * sounds.length)],
    emotion: +(Math.random().toFixed(2))
  };
}

/* =========================
   ASCII ART RENDERER
   ========================= */
function renderAscii(dream, flow) {
  const bars = Math.round(flow * 10);
  const barStr = "█".repeat(bars) + "░".repeat(10 - bars);

  console.log(`
╔══════════════════════════╗
║  DREAM FRAME ${tick}       ║
╠══════════════════════════╣
║ Scene  : ${dream.scene.padEnd(12)} ║
║ Sound  : ${dream.sound.padEnd(12)} ║
║ Emotion: ${dream.emotion.toFixed(2)}        ║
║ Flow   : ${barStr} ║
╚══════════════════════════╝
`);
}

/* =========================
   IMAGE PROMPT EXPORTER
   ========================= */
function exportPrompt(entry) {
  const prompt = `
Surreal symbolic scene of a ${entry.dream.scene},
atmosphere filled with ${entry.dream.sound},
emotional intensity ${entry.dream.emotion},
flow-state ${entry.flow.toFixed(2)},
chaos influence ${entry.chaos.toFixed(2)},
dreamlike, cinematic, introspective, moody lighting
`.trim();

  fs.appendFileSync(promptPath, prompt + "\n\n---\n\n");
}

/* =========================
   MAIN LOOP
   ========================= */
console.log("🧠 QBLS Phase 7 started — 3 hour consciousness simulation");

const interval = setInterval(() => {
  const now = Date.now();

  if (now - START_TIME >= RUN_DURATION_MS) {
    console.log("✅ QBLS Phase 7 complete. Consciousness stabilized.");
    clearInterval(interval);
    return;
  }

  tick++;

  const dream = generateDream();
  const chaos = chaosFactor();
  const coherence = Math.random();
  const flow = flowState({
    emotion: dream.emotion,
    chaos,
    coherence
  });

  const thought = generateThought();

  const entry = {
    timestamp: new Date().toISOString(),
    tick,
    dream,
    thought,
    chaos,
    coherence,
    flow,
    memory_weight: +(flow * (1 - chaos)).toFixed(3)
  };

  memory.push(entry);

  fs.writeFileSync(jsonLogPath, JSON.stringify(memory, null, 2));

  renderAscii(dream, flow);
  exportPrompt(entry);

}, TICK_INTERVAL_MS);
