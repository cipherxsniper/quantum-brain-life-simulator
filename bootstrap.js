#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const dirs = [
  "src/brain",
  "src/regions",
  "src/neurotransmitters",
  "src/neurons",
  "src/memory",
  "src/consciousness",
  "src/body",
  "src/quantum",
  "src/utils",
  "src/config",
  "docs"
];

const files = {
  "package.json": `{
  "name": "quantum-brain-life-simulator",
  "version": "0.1.0",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js"
  }
}`,

  "src/index.js": `import { Brain } from "./brain/Brain.js";

const brain = new Brain();
brain.start();`,

  "src/brain/Clock.js": `export class Clock {
  constructor(interval = 100) {
    this.interval = interval;
    this.time = 0;
  }

  tick() {
    this.time += this.interval;
    return this.time;
  }
}`,

  "src/brain/BrainState.js": `export class BrainState {
  constructor() {
    this.neurotransmitters = {};
    this.regions = {};
    this.memory = {};
  }

  snapshot() {
    return JSON.parse(JSON.stringify(this));
  }
}`,

  "src/brain/Brain.js": `import { Clock } from "./Clock.js";
import { BrainState } from "./BrainState.js";
import { Dopamine } from "../neurotransmitters/Dopamine.js";
import { Amygdala } from "../regions/Amygdala.js";
import { PrefrontalCortex } from "../regions/PrefrontalCortex.js";

export class Brain {
  constructor() {
    this.clock = new Clock();
    this.state = new BrainState();

    this.dopamine = new Dopamine(this.state);
    this.amygdala = new Amygdala(this.state);
    this.pfc = new PrefrontalCortex(this.state);
  }

  start() {
    console.log("🧠 Quantum Brain Life Simulator started");
    setInterval(() => this.cycle(), this.clock.interval);
  }

  cycle() {
    const t = this.clock.tick();

    this.dopamine.update();
    this.amygdala.process();
    this.pfc.process();

    console.log("t =", t, this.state.snapshot());
  }
}`,

  "src/neurotransmitters/Dopamine.js": `export class Dopamine {
  constructor(state) {
    this.state = state;
    this.level = 0.5;
  }

  update() {
    const noise = (Math.random() - 0.5) * 0.05;
    this.level = Math.max(0, Math.min(1, this.level + noise));
    this.state.neurotransmitters.dopamine = this.level;
  }
}`,

  "src/regions/Amygdala.js": `export class Amygdala {
  constructor(state) {
    this.state = state;
  }

  process() {
    const threat = Math.random();
    this.state.regions.amygdala = {
      threatBias: threat
    };
  }
}`,

  "src/regions/PrefrontalCortex.js": `export class PrefrontalCortex {
  constructor(state) {
    this.state = state;
  }

  process() {
    const dopamine = this.state.neurotransmitters.dopamine || 0.5;
    this.state.regions.pfc = {
      decisionWeight: dopamine
    };
  }
}`,

  "docs/roadmap.md": `# QBLS Roadmap

Phase 1:
- Core clock
- Dopamine
- Amygdala
- PFC
- Decision loop

Phase 2:
- Memory encoding
- Serotonin
- Stress axis

Phase 3:
- Visualization
- Input/output
`
};

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));
Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(path.join(process.cwd(), file), content);
});

console.log("✅ QBLS Phase 1 scaffold complete");
