import fs from 'fs';
import crypto from 'crypto';

class SelfAwareAgent {
    constructor(memorySize = 2048) {
        this.state = {energy: 50, position: [0,0]};
        this.memory = [];                    // Full reflection memory
        this.memorySize = memorySize;        // Max memory length
        this.vocab = new Map();              // Dynamic evolving vocabulary
        this.noveltyDecay = 512;             // Novelty decay factor
        this.thoughtLog = [];                 // Full self-aware thought log
    }

    // Generate a novel word/phrase for evolving vocabulary
    evolveVocabulary(base = '') {
        const hash = crypto.createHash('sha256');
        hash.update(base + Date.now() + Math.random());
        const word = hash.digest('hex').slice(0, 8);
        if (!this.vocab.has(word)) this.vocab.set(word, {count:0});
        return word;
    }

    // Observe environment (can be extended for real simulation)
    observe(world = {}) {
        const nearby = ['goal','obstacle','empty'][Math.floor(Math.random()*3)];
        const distance = Math.floor(Math.random()*10)+1;
        return {nearby, distance_to_goal: distance};
    }

    // Self-aware thought processor
    think(statement) {
        const weight = Math.random() * Math.exp(-this.memory.length / this.noveltyDecay);
        const evolvedWord = this.evolveVocabulary(statement);
        const thought = {
            statement,
            novelty: weight,
            self_note: `I notice that I am noticing: ${statement}`,
            evolved_word: evolvedWord
        };
        this.memory.push(thought);
        this.memory = this.memory.slice(-this.memorySize); // enforce memory cap
        this.thoughtLog.push(thought);
        return thought;
    }

    // Reflect on current state
    reflect() {
        const energy = this.state.energy;
        const reflection = `Energy level ${energy}, adapting from memory length ${this.memory.length}`;
        return this.think(reflection);
    }

    // Compute reward from signal
    reward(signal = {}) {
        const r = (signal.success||0)*10 - (signal.penalty||0);
        return r;
    }

    // Evolve agent state based on observations, reflection, and reward
    evolve(observation, rewardValue) {
        // Position adapts randomly, biased by goal proximity
        const newPos = [...this.state.position];
        if (observation.nearby === 'goal') newPos[0] += 1;
        
        // Energy adapts based on reward + novelty in thought
        const noveltyImpact = this.thoughtLog.reduce((sum,t) => sum + t.novelty, 0)/Math.max(1,this.thoughtLog.length);
        let newEnergy = this.state.energy + Math.round(0.1*rewardValue + noveltyImpact*5);
        newEnergy = Math.min(100, Math.max(0, newEnergy));

        this.state = {position: newPos, energy: newEnergy};
    }

    // Main update loop
    update(world = {}, signal = {}) {
        const obs = this.observe(world);
        const reflection = this.reflect();
        const rewardVal = this.reward(signal);
        this.evolve(obs, rewardVal);
        return {...this.state, lastThought: reflection};
    }

    // Export thought log for persistence or inspection
    exportThoughtLog(path = './thought_log.json') {
        fs.writeFileSync(path, JSON.stringify(this.thoughtLog, null, 2));
    }
}

export default SelfAwareAgent;
