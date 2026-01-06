// ~/qbls/src/visualization/DreamArtSimulator.js
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

export class DreamArtSimulator {
    constructor() {
        this.width = 800;
        this.height = 600;
        this.outputDir = path.resolve(process.env.HOME, 'qbls/output/dream_frames');
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    async render(frames) {
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            const canvas = createCanvas(this.width, this.height);
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#87CEEB'; // sky blue
            ctx.fillRect(0, 0, this.width, this.height);

            // Simple scene drawing based on "sight"
            ctx.fillStyle = 'green';
            if (frame.sight === 'tree') {
                ctx.fillRect(350, 300, 100, 200); // trunk
                ctx.beginPath();
                ctx.arc(400, 250, 80, 0, 2 * Math.PI); // foliage
                ctx.fill();
            } else if (frame.sight === 'river') {
                ctx.fillStyle = '#1E90FF';
                ctx.fillRect(0, 400, this.width, 100); // river
            } else if (frame.sight === 'mountain') {
                ctx.fillStyle = '#A9A9A9';
                ctx.beginPath();
                ctx.moveTo(200, 500);
                ctx.lineTo(400, 200);
                ctx.lineTo(600, 500);
                ctx.closePath();
                ctx.fill();
            }

            // Add simple text for sound/emotion
            ctx.fillStyle = 'black';
            ctx.font = '24px Arial';
            ctx.fillText(`Sound: ${frame.sound}`, 50, 50);
            ctx.fillText(`Emotion: ${frame.reward}`, 50, 90);

            // Save as PNG
            const buffer = canvas.toBuffer('image/png');
            const filePath = path.join(this.outputDir, `frame_${i + 1}.png`);
            fs.writeFileSync(filePath, buffer);
            console.log(`Saved dream frame ${i + 1}: ${filePath}`);
        }
    }
}
