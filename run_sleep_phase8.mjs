#!/usr/bin/env node
/**
 * QBL-S : Phase 8
 * Self-Observing Adaptive Cognitive System
 * Author: Thomas Lee Harvey
 */

import fs from 'fs';
import path from 'path';

const HOME = process.env.HOME;
const BASE = path.join(HOME, 'qbls');
const OUTPUT = path.join(BASE, 'output');
const LOG = path.join(OUTPUT, 'brain_log.jsonl');

if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT, { recursive: true });

/* ------------------ Utilities ------------------ */

const sleep = ms => new Promise(r => setTimeout(r, ms));
const now = () => new Date().toISOString();
const rand = (a, b) => Math.random() * (b - a) + a;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ------------------ Core State ------------------ */

let STM = [];
let LTM = [];
let reinforcement = {}; // semantic weights

/* ------------------ Concepts ------------------ */

const sights = ['tree', 'river', 'mountain', 'sky', 'shadow', 'light'];
const sounds = ['birds', 'wind', 'waterfall', 'silence', 'echo'];
const thoughts = [
  'Patterns repeat quietly',
  'Memory bends time',
  'I am observing myself',
  'Meaning emerges naturally',
  'Calm exists beneath chaos'
];

/* ------------------ Flow Equation ------------------ */

function flow(coherence, intuition, resistance) {
  return (coherence * intuition) / Math.max(resistance, 0.001);
}

/* ------------------ Logger ------------------ */

function log(entry) {
  fs.appendFileSync(LOG, JSON.stringify({ timestamp: now(), ...entry }) + '\n');
}

/* ------------------ Observer ------------------ */

function analyzePast(minutes = 10) {
  if (!fs.existsSync(LOG)) return;

  const cutoff = Date.now() - minutes * 60 * 1000;
  const lines = fs.readFileSync(LOG, 'utf8').trim().split('\n');

  lines.forEach(l => {
    const e = JSON.parse(l);
    if (new Date(e.timestamp).getTime() < cutoff) return;
    if (!e.thought || typeof e.reward !== 'number') return;

    reinforcement[e.thought] ??= 0;
    reinforcement[e.thought] += e.reward - 0.5;
  });
}

/* ------------------ Conscious Tick ------------------ */

async function consciousTick(tick) {
  analyzePast();

  const weightedThoughts = thoughts.map(t => ({
    thought: t,
    weight: (reinforcement[t] ?? 0) + 1
  }));

  const total = weightedThoughts.reduce((a, b) => a + b.weight, 0);
  let pick = Math.random() * total;
  let thought = weightedThoughts[0].thought;

  for (const t of weightedThoughts) {
    pick -= t.weight;
    if (pick <= 0) {
      thought = t.thought;
      break;
    }
  }

  const sight = sights[Math.floor(Math.random() * sights.length)];
  const sound = sounds[Math.floor(Math.random() * sounds.length)];

  let coherence = clamp(rand(0.6, 1.0) + (reinforcement[thought] ?? 0) * 0.05, 0, 1);
  let intuition = clamp(rand(0.5, 1.0), 0, 1);
  let resistance = clamp(rand(0.1, 0.6), 0.05, 1);

  const f = flow(coherence, intuition, resistance);
  const reward = clamp(f, 0, 1);

  const frame = { sight, sound, thought, reward, tick };
  STM.push(frame);

  console.log('🧠', frame);

  log({
    layer: 'conscious',
    ...frame,
    coherence,
    intuition,
    resistance,
    flow: f
  });
}

/* ------------------ Dream Phase ------------------ */

async function dream() {
  console.log('🌙 Dream phase');

  STM.forEach(f => {
    LTM.push({
      ...f,
      consolidated: true
    });

    log({
      layer: 'subconscious',
      narrative: `Dream reinforces ${f.thought}`,
      emotion: f.reward
    });

    reinforcement[f.thought] ??= 0;
    reinforcement[f.thought] += f.reward * 0.2;
  });

  STM = [];
}

/* ------------------ Runtime ------------------ */

async function run() {
  const START = Date.now();
  const DURATION = 3 * 60 * 60 * 1000;
  let tick = 0;

  log({
    system: 'QBL-S Phase 8',
    author: 'Thomas Lee Harvey',
    event: 'Adaptive cognition started'
  });

  while (Date.now() - START < DURATION) {
    await consciousTick(tick++);
    if (tick % 24 === 0) await dream();
    await sleep(5000);
  }

  log({
    event: 'Simulation complete',
    LTM_size: LTM.length,
    reinforcement
  });

  console.log('✅ Phase 8 complete');
}

run();
