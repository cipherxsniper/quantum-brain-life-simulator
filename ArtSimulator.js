export class ArtSimulator {
    constructor() {
        this.artFrames = [];
    }

    renderDream(frames) {
        frames.forEach((frame, index) => {
            const artFrame = `🎨 Frame ${index + 1}: ${frame.sight} scene with sound '${frame.sound}' and emotion ${frame.reward}`;
            this.artFrames.push(artFrame);
            console.log("Rendering art:", artFrame);
        });
    }

    clear() {
        this.artFrames = [];
    }
}
