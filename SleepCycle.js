export class SleepCycle {
    constructor(state) {
        this.state = state;
    }

    sleep(hours = 1) {
        console.log(`Sleeping for ${hours} hours...`);
        this.state.memoryStore.longTerm = this.state.memoryStore.longTerm.map(item => ({
            ...item,
            consolidated: true
        }));
    }
}
