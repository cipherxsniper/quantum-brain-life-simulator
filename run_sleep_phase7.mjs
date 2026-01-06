import fs from 'fs';
import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamArtSimulator } from './src/visualization/DreamArtSimulator.js';

// Initialize brain and sleep
const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new DreamArtSimulator();

// --- Simulated brain activity (3-hour session) ---
// Each tick is a “moment” with sensory input, conscious/subconscious layer, and English thought
const experiences = [
    { sight: 'tree', sound: 'birds', reward: 0.7, layer: 'conscious', thought: "I notice the leaves swaying gently." },
    { sight: 'river', sound: 'wind', reward: 0.5, layer: 'subconscious', thought: "A fleeting feeling of calm passes by." },
    { sight: 'mountain', sound: 'waterfall', reward: 0.9, layer: 'conscious', thought: "The grandeur of the waterfall is awe-inspiring." },
    { sight: 'meadow', sound: 'insects', reward: 0.6, layer: 'subconscious', thought: "There's a quiet energy here, almost invisible." },
    { sight: 'sunset', sound: 'silence', reward: 1.0, layer: 'conscious', thought: "The sky burns with gold and crimson." }
];

// Tick all experiences into brain
for (const exp of experiences) {
    brain.tick(exp);
}

// Sleep phase — consolidate memory
sleep.sleep(3);

// Generate dream frames with layer info and English thoughts
const dreamFrames = brain.state.memoryStore.longTerm.map(frame => ({
    ...frame,
    dreamified: true,
    layerColor: frame.layer === 'conscious' ? '#FFD700' : '#9370DB'
}));

console.log('Generated dream frames:', dreamFrames);

// Render the art frames (visualization)
await artSim.render(dreamFrames);

// Save full brain memory to JSON file
const outputFile = './qbls/brain_memory_3hours.json';
fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    memory: brain.state.memoryStore.longTerm,
    layers: brain.state.layers
}, null, 2));

console.log(`Brain memory saved to ${outputFile}`);
console.log('Long-term memory after sleep:', brain.state.memoryStore.longTerm);
