export class Dopamine {
  constructor(state) {
    this.state = state;
    this.level = 0.5; // 0-1 baseline
  }

  spike(amount) {
    this.level = Math.max(0, Math.min(1, this.level + amount));
    this.state.neurotransmitters.dopamine = this.level;
  }

  decay() {
    this.level *= 0.98; // gradual decay
    this.state.neurotransmitters.dopamine = this.level;
  }
}
