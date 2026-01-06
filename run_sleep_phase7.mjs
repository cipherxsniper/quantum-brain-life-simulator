import fs from 'fs';
import path from 'path';
import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamArtSimulator } from './src/visualization/DreamArtSimulator.js';

// Constants
const SIMULATION_HOURS = 3;
const TICKS_PER_HOUR = 60; // simulate 1 tick per minute
const TOTAL_TICKS = SIMULATION_HOURS * TICKS_PER_HOUR;
const OUTPUT_JSON = path.resolve('./dream_memory_live.json');

// Initialize components
const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new DreamArtSimulator();

// Helpers
function randomThought() {
    const thoughts = [
        "Reflecting on memory patterns",
        "Visualizing past experiences",
        "Imagining future possibilities",
        "Noticing patterns in nature",
        "Feeling emotions deeply",
        "Exploring subconscious imagery",
        "Linking sensations to reward signals",
        "Contemplating the flow of time"
    ];
    return thoughts[Math.floor(Math.random() * thoughts.length)];
}

// Natural Flow State Equation Simulation
function flowState(focus, reward, chaos) {
    // Thomas Lee Harvey inspired: flow = (focus * reward) / (1 + chaos)
    return (focus * reward) / (1 + chaos);
}

// Chaos / Butterfly effect simulation
function chaosFactor() {
    return Math.random(); // simple placeholder for environmental & neural chaos
}

// Real-time simulation loop
async function runSimulation() {
    console.log(`Starting ${SIMULATION_HOURS}-hour QBLS simulation...`);

    for (let tick = 1; tick <= TOTAL_TICKS; tick++) {
        // Generate sensory input
        const sights = ['tree', 'river', 'mountain', 'sky', 'ocean', 'forest'];
        const sounds = ['birds', 'wind', 'waterfall', 'rain', 'waves', 'leaves'];
        const rewards = [0.3, 0.5, 0.7, 0.9, 1.0];

        const input = {
            sight: sights[Math.floor(Math.random() * sights.length)],
            sound: sounds[Math.floor(Math.random() * sounds.length)],
            reward: rewards[Math.floor(Math.random() * rewards.length)]
        };

        // Tick brain
        brain.tick(input);

        // Generate a thought in English
        const thought = randomThought();
        brain.state.memoryStore.longTerm.push({ thought, tick, language: 'English' });

        // Apply flow state and chaos
        const chaos = chaosFactor();
        const focus = brain.attention.focus;
        const emotion = flowState(focus, input.reward, chaos);

        // Dreamify the frame
        const dreamFrame = { ...input, dreamified: true, emotion, tick };
        brain.state.memoryStore.longTerm.push(dreamFrame);

        // Render art
        artSim.render([dreamFrame]);

        // Save JSON
        fs.writeFileSync(OUTPUT_JSON, JSON.stringify(brain.state.memoryStore.longTerm, null, 2));

        // Every 10 ticks, print status
        if (tick % 10 === 0) {
            console.log(`Tick ${tick}/${TOTAL_TICKS} complete. Long-term memory length: ${brain.state.memoryStore.longTerm.length}`);
        }

        // Optional: simulate 1 second delay to slow down loop for real-time monitoring
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Sleep phase at end of simulation
    sleep.sleep(SIMULATION_HOURS);

    console.log("Simulation complete!");
    console.log("Long-term memory after sleep:", brain.state.memoryStore.longTerm);
}

// Run simulation
await runSimulation();
