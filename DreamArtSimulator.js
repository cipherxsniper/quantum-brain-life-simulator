export class DreamArtSimulator {
    constructor() {
        this.frames = [];
    }

    /**
     * Render dream frames as simple terminal art
     * @param {Array} dreamFrames - Array of frames with { sight, sound, emotion, tick }
     */
    render(dreamFrames) {
        for (const frame of dreamFrames) {
            this.frames.push(frame);

            // Generate a simple terminal "art preview"
            const width = 40;
            const emotionBarLength = Math.floor(frame.emotion * width);
            const emptyBarLength = width - emotionBarLength;
            const emotionBar = '█'.repeat(emotionBarLength) + '░'.repeat(emptyBarLength);

            console.log(`🎨 Tick ${frame.tick}: ${frame.sight} scene with sound '${frame.sound}'`);
            console.log(`Emotion/Flow State: [${emotionBar}] ${frame.emotion.toFixed(2)}\n`);
        }
    }

    clear() {
        this.frames = [];
    }

    getAllFrames() {
        return this.frames;
    }
}
