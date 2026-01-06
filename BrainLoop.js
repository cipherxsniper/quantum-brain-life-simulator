import { SensoryInput } from '../sensory/SensoryInput.js';
import { Attention } from '../attention/Attention.js';
import { Visualize } from '../visualization/Visualize.js';

export class BrainLoop {
    constructor() {
        this.sensory = new SensoryInput();
        this.attention = new Attention();
        this.visual = new Visualize();
        this.state = {
            memoryStore: { longTerm: [] }
        };
    }

    tick(input) {
        const sensed = this.sensory.sense(input);
        this.attention.increase(0.5);
        this.state.memoryStore.longTerm.push(sensed);
        this.visual.render(sensed);
    }
}
