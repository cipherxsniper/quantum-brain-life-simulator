import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamArtSimulator } from './src/visualization/DreamArtSimulator.js';

const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new DreamArtSimulator(`${process.env.HOME}/qbls/output/dream_frames`);

brain.tick({ sight: 'tree', sound: 'birds', reward: 0.7 });
brain.tick({ sight: 'river', sound: 'wind', reward: 0.5 });
brain.tick({ sight: 'mountain', sound: 'waterfall', reward: 0.9 });

// Sleep phase
sleep.sleep(3);

// Generate dream frames
const dreamFrames = brain.state.memoryStore.longTerm.map(frame => ({
    ...frame,
    dreamified: true
}));

console.log('Generated dream frames:', dreamFrames);

// Render the art frames as images
await artSim.render(dreamFrames);

console.log('Long-term memory after sleep:', brain.state.memoryStore.longTerm);
