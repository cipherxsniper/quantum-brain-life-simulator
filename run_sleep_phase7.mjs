import fs from 'fs';
import path from 'path';
import { BrainLoop } from './src/core/BrainLoop.js';
import { SleepCycle } from './src/sleep/SleepCycle.js';
import { DreamArtSimulator } from './src/visualization/DreamArtSimulator.js';

// Initialize brain, sleep, art simulator
const brain = new BrainLoop();
const sleep = new SleepCycle(brain.state);
const artSim = new DreamArtSimulator();

// Simulation parameters
const totalHours = 3;
const ticksPerHour = 60; // 1 tick per simulated minute
const totalTicks = totalHours * ticksPerHour;
const realTimeDelay = 1000; // 1 second = 1 simulated minute

// Output JSON path
const outputPath = path.resolve('./dream_memory_live.json');
fs.writeFileSync(outputPath, JSON.stringify({ brainHistory: [], dreamFrames: [], thoughts: [] }, null, 2), 'utf-8');

// Flow state equation (Thomas Lee Harvey)
function flowState(focus, emotion, sensory, memoryImpact) {
  return Math.tanh(focus * emotion * (sensory + memoryImpact));
}

// Chaos / Butterfly effect
function chaos(delta = 0.05) {
  return (Math.random() - 0.5) * delta;
}

// Dynamic thought generator
function generateThought(memory, tick) {
  const memorySummary = memory.length
    ? `Reflecting on ${memory.length} past experience(s)`
    : 'A fresh mind';
  const emotions = ['curiosity', 'wonder', 'awe', 'peace', 'confusion'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  return `${memorySummary}, at tick ${tick + 1} I feel ${emotion}.`;
}

// Async tick function
async function runTick(tick) {
  const input = {
    sight: ['tree', 'river', 'mountain'][tick % 3],
    sound: ['birds', 'wind', 'waterfall'][tick % 3],
    reward: Math.random(),
    thought: generateThought(brain.state.memoryStore.longTerm, tick)
  };

  // Brain tick
  const chaoticReward = input.reward + chaos(0.1);
  brain.tick({ ...input, reward: chaoticReward });

  // Flow state
  const currentFlow = flowState(brain.attention.focus, chaoticReward, 1, brain.state.memoryStore.longTerm.length);

  // Subconscious mapping
  const subconsciousLayer = brain.state.memoryStore.longTerm.map(f => ({
    ...f,
    dreamified: true
  }));

  // Tick record
  const tickRecord = {
    tick: tick + 1,
    timestamp: new Date().toISOString(),
    input,
    chaoticReward,
    flowState: currentFlow,
    memorySnapshot: [...brain.state.memoryStore.longTerm],
    subconsciousLayer,
    consciousThought: input.thought
  };

  // Update JSON
  const currentData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
  currentData.brainHistory.push(tickRecord);
  currentData.thoughts.push({ tick: tick + 1, timestamp: tickRecord.timestamp, thought: input.thought, language: 'English' });
  fs.writeFileSync(outputPath, JSON.stringify(currentData, null, 2), 'utf-8');

  console.log(`Tick ${tick + 1}: Thought='${input.thought}' Flow=${currentFlow.toFixed(3)}`);
}

// Run simulation
(async () => {
  console.log(`\n🚀 Starting 3-hour real-time brain simulation...`);

  for (let tick = 0; tick < totalTicks; tick++) {
    await runTick(tick);
    await new Promise(res => setTimeout(res, realTimeDelay));
  }

  // Sleep consolidation
  sleep.sleep(totalHours);

  // Generate dream frames
  const dreamFrames = brain.state.memoryStore.longTerm.map((frame, idx) => ({
    ...frame,
    dreamified: true,
    language: 'English',
    subconsciousLayerColor: ['#FF5733', '#33FF57', '#3357FF'][idx % 3]
  }));

  // Render art
  await artSim.render(dreamFrames);

  // Save final JSON
  const finalData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
  finalData.dreamFrames = dreamFrames;
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf-8');

  console.log(`\n✅ 3-hour simulation complete! Data saved to ${outputPath}`);
  console.log('\nLong-term memory after sleep:', brain.state.memoryStore.longTerm);
})();
