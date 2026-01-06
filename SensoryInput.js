export class SensoryInput {
    constructor() {
        this.data = [];
    }

    sense(input) {
        this.data.push(input);
        return input;
    }
}
