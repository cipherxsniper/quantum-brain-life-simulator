export class Visualize {
    constructor() {
        this.frames = [];
    }

    render(data) {
        this.frames.push(data);
        console.log("Rendering frame:", data);
    }

    clear() {
        this.frames = [];
    }
}
