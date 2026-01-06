import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamArtSimulator } from './src/visualization/DreamArtSimulator.js';

// Initialize brain and sleep
const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new DreamArtSimulator();

// Tick experiences into brain
brain.tick({ sight: 'tree', sound: 'birds', reward: 0.7, layer: 'conscious' });
brain.tick({ sight: 'river', sound: 'wind', reward: 0.5, layer: 'subconscious' });
brain.tick({ sight: 'mountain', sound: 'waterfall', reward: 0.9, layer: 'conscious' });

// Sleep phase — consolidates memory
sleep.sleep(3);

// Generate dream frames based on conscious + subconscious layers
const dreamFrames = brain.state.memoryStore.longTerm.map(frame => ({
    ...frame,
    dreamified: true,
    layerColor: frame.layer === 'conscious' ? '#FFD700' : '#9370DB' // gold for conscious, purple for subconscious
}));

console.log('Generated dream frames:', dreamFrames);

// Render art frames as images reflecting layers
await artSim.render(dreamFrames);

console.log('Long-term memory after sleep:', brain.state.memoryStore.longTerm);
