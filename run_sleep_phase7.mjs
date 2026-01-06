#!/usr/bin/env node

import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamArtSimulator } from './src/visualization/DreamArtSimulator.js';
import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas'; // npm install canvas

// Output files
const memoryFile = path.resolve('./dream_memory_live.json');
const timelineFile = path.resolve('./subconscious_conscious_timeline.png');

// Initialize brain, sleep, art simulator
const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new DreamArtSimulator();

// Timeline tracking
const timelineData = [];

// Thomas Lee Harvey’s Natural Flow + Chaos model
function naturalFlow(input, previousFrame) {
  const butterfly = (Math.random() - 0.5) * 0.1; // chaos factor
  const emotionFlow = previousFrame
    ? previousFrame.reward + butterfly + Math.sin(Date.now() / 100000)
    : input.reward + butterfly;

  const subconsciousInfluence = previousFrame ? previousFrame.reward * 0.3 : 0;
  const consciousInfluence = input.reward * 0.7;

  return {
    ...input,
    reward: Math.min(Math.max(emotionFlow + subconsciousInfluence + consciousInfluence, 0), 1)
  };
}

// Generate a brain tick/frame
function generateFrame(input) {
  const previousFrame = brain.state.memoryStore.longTerm.at(-1);
  const flowInput = naturalFlow(input, previousFrame);

  brain.tick(flowInput);

  const latestFrame = {
    ...brain.state.memoryStore.longTerm.at(-1),
    dreamified: true,
    thought: `English conscious/subconscious record for sight '${flowInput.sight}' and sound '${flowInput.sound}'`,
    chaosFactor: flowInput.reward - input.reward,
    consciousContribution: input.reward * 0.7,
    subconsciousContribution: previousFrame ? previousFrame.reward * 0.3 : 0
  };

  // Render art preview
  artSim.render([latestFrame]);

  // Record for timeline
  timelineData.push({
    timestamp: Date.now(),
    conscious: latestFrame.consciousContribution,
    subconscious: latestFrame.subconsciousContribution
  });

  // Save updated memory JSON
  fs.writeFileSync(memoryFile, JSON.stringify(brain.state.memoryStore.longTerm, null, 2));

  return latestFrame;
}

// Sensory inputs
const sensoryInputs = [
  { sight: 'tree', sound: 'birds', reward: 0.7 },
  { sight: 'river', sound: 'wind', reward: 0.5 },
  { sight: 'mountain', sound: 'waterfall', reward: 0.9 },
  { sight: 'forest', sound: 'stream', reward: 0.6 },
  { sight: 'beach', sound: 'waves', reward: 0.8 },
  { sight: 'city', sound: 'traffic', reward: 0.4 }
];

// Render a timeline of subconscious/conscious activity
function renderTimeline() {
  const width = 1200;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, width, height);

  // Draw timeline
  const maxVal = 1; // reward scale
  timelineData.forEach((point, i) => {
    const x = (i / timelineData.length) * width;
    const consciousY = height - point.conscious * height;
    const subconsciousY = height - point.subconscious * height;

    // Subconscious: blue line
    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.moveTo(x, subconsciousY);
    ctx.lineTo(x + 2, subconsciousY);
    ctx.stroke();

    // Conscious: green line
    ctx.strokeStyle = '#0f0';
    ctx.beginPath();
    ctx.moveTo(x, consciousY);
    ctx.lineTo(x + 2, consciousY);
    ctx.stroke();
  });

  fs.writeFileSync(timelineFile, canvas.toBuffer('image/png'));
  console.log('Timeline visualization saved to:', timelineFile);
}

// Run for 3 hours
const totalDurationMs = 10800000;
const tickIntervalMs = 10000; // 10 seconds per tick
let elapsedMs = 0;

console.log('Starting 3-hour QBLS brain test with full natural flow, chaos, and timeline visualization...');
console.log('Memory JSON live update at:', memoryFile);
console.log('Timeline PNG will update at the end at:', timelineFile);

const interval = setInterval(() => {
  const input = sensoryInputs[Math.floor(Math.random() * sensoryInputs.length)];
  const frame = generateFrame(input);
  elapsedMs += tickIntervalMs;

  console.log('Tick complete. Frame added:', frame);

  if (elapsedMs >= totalDurationMs) {
    clearInterval(interval);
    sleep.sleep(3); // consolidate memory
    renderTimeline();
    console.log('3-hour test completed!');
    console.log('Final long-term memory saved to:', memoryFile);
    process.exit(0);
  }
}, tickIntervalMs);
