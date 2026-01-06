// ~/qbls/src/visualization/ArtSimulator.js
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

export class ArtSimulator {
    constructor() {
        this.outputDir = path.join(process.env.HOME, 'qbls', 'art_output');
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
        this.frameCount = 0;
    }

    render(frame) {
        this.frameCount++;
        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background color based on emotion
        const emotion = frame.reward || 0.5; // 0 = sad, 1 = happy
        const colorValue = Math.floor(255 * emotion);
        ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, 255)`; // bluish based on emotion
        ctx.fillRect(0, 0, width, height);

        // Draw text of sight + sound
        ctx.fillStyle = 'black';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`Sight: ${frame.sight}`, 50, 200);
        ctx.fillText(`Sound: ${frame.sound}`, 50, 300);
        ctx.fillText(`Emotion: ${emotion}`, 50, 400);

        // Save the frame as PNG
        const filename = path.join(this.outputDir, `frame_${this.frameCount}.png`);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);

        console.log(`🎨 Frame ${this.frameCount} saved to ${filename}`);
    }

    clear() {
        this.frameCount = 0;
    }
}
