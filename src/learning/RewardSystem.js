export class RewardSystem {
  constructor(state, dopamine) {
    this.state = state;
    this.dopamine = dopamine;
  }

  trigger(eventValue) {
    // eventValue: 0-1 scale
    this.dopamine.spike(eventValue);
    if(this.state.memoryStore) {
      // Weight memories based on dopamine
      const shortTermSnapshot = this.state.memoryStore.snapshot().shortTerm;
      shortTermSnapshot.forEach(mem => mem.weight = this.dopamine.level);
    }
  }
}
