export class MemoryStore {
  constructor() {
    this.shortTerm = [];
    this.longTerm = [];
  }

  addShortTerm(memory) {
    this.shortTerm.push(memory);
    if (this.shortTerm.length > 50) this.shortTerm.shift();
  }

  addLongTerm(memory) {
    this.longTerm.push(memory);
  }

  snapshot() {
    return {
      shortTerm: [...this.shortTerm],
      longTerm: [...this.longTerm]
    };
  }
}
