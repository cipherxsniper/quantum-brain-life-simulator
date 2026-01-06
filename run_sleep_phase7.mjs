import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { ArtSimulator } from './src/visualization/ArtSimulator.js';

const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new ArtSimulator();

brain.tick({ sight: 'tree', sound: 'birds', reward: 0.7 });
brain.tick({ sight: 'river', sound: 'wind', reward: 0.5 });
brain.tick({ sight: 'mountain', sound: 'waterfall', reward: 0.9 });

sleep.sleep(3);

// “Dreamify” memory
const dreamFrames = brain.state.memoryStore.longTerm.map(item => ({
    ...item,
    dreamified: true
}));

// Render dream frames as art
artSim.render(dreamFrames);

console.log("Long-term memory after sleep:", brain.state.memoryStore.longTerm);
