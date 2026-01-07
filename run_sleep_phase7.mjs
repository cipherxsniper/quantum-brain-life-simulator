#!/usr/bin/env node
/**
 * QBL-S : Phase 7
 * Author: Thomas Lee Harvey (with ChatGPT)
 * Description:
 * Continuous 3-hour cognitive simulation with
 * conscious + subconscious layers, chaos dynamics,
 * flow-state stabilization, and real-time recording.
 */

import fs from 'fs';
import path from 'path';

const HOME = process.env.HOME;
const OUTPUT_DIR = path.join(HOME, 'qbls', 'output');
const LOG_FILE = path.join(OUTPUT_DIR, 'brain_log.jsonl');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/* ------------------ Utility ------------------ */

const sleep = ms => new Promise(res => setTimeout(res, ms));
const now = () => new Date().toISOString();
const rand = (min, max) => Math.random() * (max - min) + min;

/* ------------------ Core Concepts ------------------ */

/**
 * Natural Flow State Equation (TLH)
 * Flow = (Coherence × Intuition) / Resistance
 */
function flowState({ coherence, intuition, resistance }) {
  return (coherence * intuition) / Math.max(resistance, 0.0001);
}

/**
 * Butterfly Effect / Chaos Injection
 */
function chaosPerturb(value, intensity = 0.03) {
  return value + rand(-intensity, intensity);
}

/* ------------------ Memory Stores ------------------ */

let shortTermMemory = [];
let longTermMemory = [];

/* ------------------ Recorder ------------------ */

function record(entry) {
  const data = {
    timestamp: now(),
    ...entry
  };
  fs.appendFileSync(LOG_FILE, JSON.stringify(data) + '\n');
}

/* ------------------ Perception ------------------ */

const sights = ['tree', 'river', 'mountain', 'sky', 'shadow', 'light'];
const sounds = ['birds', 'wind', 'waterfall', 'silence', 'echo'];
const thoughts = [
  'Observing patterns in nature',
  'Everything feels connected',
  'A memory surfaces unexpectedly',
  'There is calm in uncertainty',
  'Meaning emerges without effort'
];

/* ------------------ Conscious Loop ------------------ */

async function consciousTick(tick) {
  const sight = sights[Math.floor(Math.random() * sights.length)];
  const sound = sounds[Math.floor(Math.random() * sounds.length)];
  const thought = thoughts[Math.floor(Math.random() * thoughts.length)];

  let coherence = rand(0.6, 1.0);
  let intuition = rand(0.5, 1.0);
  let resistance = rand(0.1, 0.6);

  coherence = chaosPerturb(coherence);
  intuition = chaosPerturb(intuition);
  resistance = chaosPerturb(resistance);

  const flow = flowState({ coherence, intuition, resistance });
  const reward = Math.min(Math.max(flow, 0), 1);

  const frame = {
    sight,
    sound,
    thought,
    reward,
    tick
  };

  shortTermMemory.push(frame);

  console.log('Rendering frame:', frame);

  record({
    layer: 'conscious',
    ...frame,
    coherence,
    intuition,
    resistance,
    flow
  });
}

/* ------------------ Sleep & Dream ------------------ */

async function sleepPhase() {
  console.log('Entering sleep phase...');

  const dreams = shortTermMemory.map(frame => {
    const dream = {
      sight: frame.sight,
      sound: frame.sound,
      emotion: frame.reward,
      consolidated: true,
      dreamified: true
    };

    record({
      layer: 'subconscious',
      ...dream,
      narrative: `Dreaming of ${frame.sight} with a sense of ${frame.reward}`
    });

    return dream;
  });

  longTermMemory.push(
    ...dreams.map(d => ({
      sight: d.sight,
      sound: d.sound,
      reward: d.emotion,
      consolidated: true
    }))
  );

  shortTermMemory = [];

  console.log('Dreams generated:', dreams.length);
}

/* ------------------ Main Runtime ------------------ */

async function run() {
  const START = Date.now();
  const DURATION = 3 * 60 * 60 * 1000; // 3 hours
  let tick = 0;

  record({
    system: 'QBL-S Phase 7',
    author: 'Thomas Lee Harvey',
    event: 'Simulation started'
  });

  while (Date.now() - START < DURATION) {
    await consciousTick(tick);
    tick++;

    if (tick % 30 === 0) {
      await sleepPhase();
    }

    await sleep(5000); // 1 cognition cycle every 5 seconds
  }

  record({
    event: 'Simulation completed',
    longTermMemorySize: longTermMemory.length
  });

  console.log('3-hour simulation complete.');
  console.log('Long-term memory:', longTermMemory);
}

run();
