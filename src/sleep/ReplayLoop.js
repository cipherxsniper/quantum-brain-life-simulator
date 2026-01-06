export class ReplayLoop {
  constructor(state) { this.state = state; }

  consolidate(dreamEvents = []) {
    if(!this.state.memoryStore) return;
    dreamEvents.forEach(event => {
      // Add to long-term memory with modified weight
      this.state.memoryStore.longTerm.push({
        ...event,
        weight: Math.min(1, (event.weight || 0) + 0.1)
      });
    });
  }
}
