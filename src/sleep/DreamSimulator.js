export class DreamSimulator {
  constructor(state) { this.state = state; }

  generate() {
    if(!this.state.memoryStore) return [];
    const shortTerm = this.state.memoryStore.shortTerm || [];
    // Shuffle and abstract short-term memories into "dream events"
    return shortTerm.map(mem => ({
      ...mem,
      weight: mem.weight * Math.random(),
      dreamed: true
    }));
  }
}
