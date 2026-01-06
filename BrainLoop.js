import { SensoryInput } from '../sensory/SensoryInput.js';
import { Attention } from '../attention/Attention.js';
import { ArtSimulator } from '../visualization/ArtSimulator.js';

export class BrainLoop {
    constructor() {
        this.sensory = new SensoryInput();
        this.attention = new Attention();
        this.visual = new ArtSimulator();
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
