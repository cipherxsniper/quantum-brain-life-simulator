import fs from 'fs';
import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamArtSimulator } from './src/visualization/DreamArtSimulator.js';

// Initialize brain, sleep cycle, and art simulator
const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new DreamArtSimulator();

// Simulate input over 3 hours (for example, 1 tick per "hour")
// You can increase granularity if desired
const inputs = [
    { sight: 'tree', sound: 'birds', reward: 0.7, thought: "I see the tree swaying, feeling peaceful" },
    { sight: 'river', sound: 'wind', reward: 0.5, thought: "The river flows, ideas keep moving in my mind" },
    { sight: 'mountain', sound: 'waterfall', reward: 0.9, thought: "The waterfall reminds me of strength and perseverance" },
    { sight: 'sky', sound: 'breeze', reward: 0.6, thought: "Looking at the sky, I reflect on past memories" },
    { sight: 'meadow', sound: 'insects', reward: 0.8, thought: "The meadow feels like an untouched corner of my mind" }
];

// Tick the brain with sensory inputs
inputs.forEach(input => {
    brain.tick(input);
});

// Sleep phase: consolidate memories
sleep.sleep(3);

// Generate dream frames with conscious/subconscious layers
const dreamFrames = brain.state.memoryStore.longTerm.map((frame, idx) => ({
    ...frame,
    dreamified: true,
    layerColor: idx % 2 === 0 ? '#FFD700' : '#9370DB', // gold = conscious, purple = subconscious
    thought: frame.thought || `No thought recorded for frame ${idx + 1}`
}));

console.log('Generated dream frames:', dreamFrames);

// Render the dream frames (console visualization)
await artSim.render(dreamFrames);

// Save long-term memory to JSON for review
const memoryFile = './qbls_longterm_memory.json';
fs.writeFileSync(memoryFile, JSON.stringify(brain.state.memoryStore.longTerm, null, 2), 'utf-8');
console.log(`Long-term memory saved to ${memoryFile}`);
