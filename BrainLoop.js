import { SensoryInput } from '../sensory/SensoryInput.js';
import { Attention } from '../attention/Attention.js';
import { DreamArtSimulator } from '../visualization/DreamArtSimulator.js';

export class BrainLoop {
    constructor() {
        this.sensory = new SensoryInput();
        this.attention = new Attention();
        this.visual = new DreamArtSimulator();
        this.state = {
            memoryStore: { longTerm: [] },
            layers: { conscious: [], subconscious: [] }
        };
    }

    tick(input) {
        const sensed = this.sensory.sense(input);
        this.attention.increase(0.5);

        // Store in long-term memory
        this.state.memoryStore.longTerm.push(sensed);

        // Separate into layers
        if (sensed.layer === 'conscious') {
            this.state.layers.conscious.push(sensed);
        } else {
            this.state.layers.subconscious.push(sensed);
        }

        this.visual.render(sensed);
    }
}
