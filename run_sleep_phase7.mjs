import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamArtSimulator } from './src/visualization/DreamArtSimulator.js';
// Helper to simulate async rendering (like generating art per frame)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const brain = new BrainLoop();
    const sleep = new SleepCycle(brain.state);
    const artSim = new DreamArtSimulator();

    // Feed sensory input
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

    // Render the art frames asynchronously
    for (let i = 0; i < dreamFrames.length; i++) {
        artSim.render(dreamFrames[i], i + 1);
        // Wait 1 second between frames to simulate processing/rendering
        await delay(1000);
    }

    console.log('Long-term memory after sleep:', brain.state.memoryStore.longTerm);
}

// Run main
main();
