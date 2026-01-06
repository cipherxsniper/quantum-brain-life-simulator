import { SensoryInput } from '../sensory/SensoryInput.js';
import { Attention } from '../attention/Attention.js';
import { Visualize } from '../visualization/Visualize.js';
import { Dopamine } from '../neurotransmitters/Dopamine.js';
import { Serotonin } from '../neurotransmitters/Serotonin.js';
import { Norepinephrine } from '../neurotransmitters/Norepinephrine.js';
import { RewardSystem } from '../learning/RewardSystem.js';
import { LearningLoop } from '../learning/LearningLoop.js';
import { MotorOutput } from '../motor/MotorOutput.js';

export class BrainLoop {
  constructor() {
    this.state = {
      sensory: {},
      attended: [],
      neurotransmitters: {},
      memoryStore: { shortTerm: [], longTerm: [] },
      stress: 0,
      actions: []
    };

    this.sensory = new SensoryInput(this.state);
    this.attention = new Attention(this.state);
    this.visualize = new Visualize(this.state);
    this.dopamine = new Dopamine(this.state);
    this.serotonin = new Serotonin(this.state);
    this.norepinephrine = new Norepinephrine(this.state);
    this.reward = new RewardSystem(this.state, this.dopamine);
    this.learning = new LearningLoop(this.state);
    this.motor = new MotorOutput(this.state);
  }

  tick(input = {}) {
    // Sensory input
    this.sensory.receive(input);

    // Attention updates
    this.attention.update();

    // Neurotransmitters update
    this.dopamine.decay();
    this.serotonin.update();
    this.norepinephrine.update();

    // Reward consolidation
    if(input.reward) this.reward.trigger(input.reward);

    // Memory consolidation
    this.learning.consolidate();

    // Motor actions
    this.motor.act();

    // Render brain snapshot
    this.visualize.render();
  }
}
