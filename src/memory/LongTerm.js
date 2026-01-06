export class LongTermMemory {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  consolidate(shortTermSnapshot) {
    shortTermSnapshot.forEach(memory => {
      this.memoryStore.addLongTerm({
        ...memory,
        weight: Math.random() // placeholder for emotional impact
      });
    });
  }
}
