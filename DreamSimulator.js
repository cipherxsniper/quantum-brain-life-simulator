export class DreamSimulator {
    constructor(state) {
        this.state = state;
    }

    generateDream() {
        if (!this.state.memoryStore.longTerm.length) return [];
        const dreamFrames = this.state.memoryStore.longTerm.map(item => ({
            ...item,
            dreamified: true
        }));
        console.log("Generated dream frames:", dreamFrames);
        return dreamFrames;
    }
}
