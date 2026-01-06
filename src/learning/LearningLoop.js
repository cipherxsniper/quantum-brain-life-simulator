export class LearningLoop {
  constructor(state) {
    this.state = state;
  }

  consolidate() {
    if(this.state.memoryStore) {
      const longTerm = new (require('../memory/LongTerm.js').LongTermMemory)(this.state.memoryStore);
      const snapshot = this.state.memoryStore.snapshot().shortTerm;
      longTerm.consolidate(snapshot);
    }
  }
}
