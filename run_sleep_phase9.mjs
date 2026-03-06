import SelfAwareAgent from './run_sleep_phase9.mjs';

// Instantiate the agent
const agent = new SelfAwareAgent(2048);

// Number of ticks to simulate
const TOTAL_TICKS = 100;

// Optional: world/environment simulation (can be extended)
const world = {};

// Run simulation loop
for (let tick = 0; tick < TOTAL_TICKS; tick++) {
    const state = agent.update(world, { success: Math.random() < 0.5 ? 1 : 0 }); // random success signal
    console.log(`🧠 Tick ${tick}:`, state);
}

// Export thought log to JSON
agent.exportThoughtLog('phase9_thought_log.json');

console.log('✅ Simulation complete. Thought log saved to phase9_thought_log.json');
