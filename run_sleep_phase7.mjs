#!/usr/bin/env node

import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamArtSimulator } from './src/visualization/DreamArtSimulator.js';
import fs from 'fs';
import path from 'path';

// Output JSON file
const outputFile = path.resolve('./dream_memory_live.json');

// Initialize brain, sleep, and art simulator
const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new DreamArtSimulator();

// Function to generate a tick/frame
function generateFrame(input) {
  brain.tick(input);

  // Add dreamification & English thought
  const latestFrame = {
    ...brain.state.memoryStore.longTerm.at(-1),
    dreamified: true,
    thought: `Recording English conscious/subconscious observation for sight '${input.sight}' and sound '${input.sound}'`
  };

  // Render art preview
  artSim.render([latestFrame]);

  // Save updated long-term memory to JSON in real-time
  fs.writeFileSync(outputFile, JSON.stringify(brain.state.memoryStore.longTerm, null, 2));

  return latestFrame;
}

// Example inputs to feed continuously
const sensoryInputs = [
  { sight: 'tree', sound: 'birds', reward: 0.7 },
  { sight: 'river', sound: 'wind', reward: 0.5 },
  { sight: 'mountain', sound: 'waterfall', reward: 0.9 },
  { sight: 'forest', sound: 'stream', reward: 0.6 },
  { sight: 'beach', sound: 'waves', reward: 0.8 },
  { sight: 'city', sound: 'traffic', reward: 0.4 }
];

// Run continuously for 3 hours (10800 seconds)
const totalDurationMs = 10800000;
const tickIntervalMs = 10000; // 10 seconds per tick
let elapsedMs = 0;

console.log('Starting 3-hour QBLS brain test...');
console.log('Output JSON will be updated live at:', outputFile);

const interval = setInterval(() => {
  const input = sensoryInputs[Math.floor(Math.random() * sensoryInputs.length)];
  const frame = generateFrame(input);
  elapsedMs += tickIntervalMs;

  console.log('Tick complete. Frame added:', frame);

  if (elapsedMs >= totalDurationMs) {
    clearInterval(interval);
    sleep.sleep(3); // Consolidate memory after full run
    console.log('3-hour test completed!');
    console.log('Final long-term memory saved to:', outputFile);
    process.exit(0);
  }
}, tickIntervalMs);
