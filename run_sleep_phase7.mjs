import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamSimulator } from './src/sleep/DreamSimulator.js';
import { ArtSimulator } from './src/visualization/ArtSimulator.js';

// Initialize systems
const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new ArtSimulator();

// Simulate daily sensory input
brain.tick({ sight: 'tree', sound: 'birds', reward: 0.7 });
brain.tick({ sight: 'river', sound: 'wind', reward: 0.5 });
brain.tick({ sight: 'mountain', sound: 'waterfall', reward: 0.9 });

// Sleep consolidates memory
sleep.sleep(3);

// Generate dream from consolidated memory
const dreamSim = new DreamSimulator(brain.state);
const dreamFrames = dreamSim.generateDream();

// Render dream as art
artSim.renderDream(dreamFrames);

// Final memory check
console.log("Long-term memory after sleep:", brain.state.memoryStore.longTerm);
