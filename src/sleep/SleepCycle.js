import { DreamSimulator } from './DreamSimulator.js';
import { ReplayLoop } from './ReplayLoop.js';

export class SleepCycle {
  constructor(state) {
    this.state = state;
    this.dream = new DreamSimulator(state);
    this.replay = new ReplayLoop(state);
  }

  sleep(duration = 5) {
    console.log("Entering sleep...");
    for(let i = 0; i < duration; i++) {
      // Generate dream sequence
      const dreamEvents = this.dream.generate();
      // Replay memories with dream weighting
      this.replay.consolidate(dreamEvents);
    }
    console.log("Sleep cycle complete. Memory consolidated.");
  }
}
