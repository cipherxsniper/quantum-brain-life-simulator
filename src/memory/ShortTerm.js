export class ShortTermMemory {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  encode(event) {
    this.memoryStore.addShortTerm({
      event,
      timestamp: Date.now()
    });
  }
}
