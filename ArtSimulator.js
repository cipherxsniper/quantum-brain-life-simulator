// ~/qbls/src/visualization/ArtSimulator.js
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

export class ArtSimulator {
    constructor() {
        this.outputDir = path.resolve(process.env.HOME, 'qbls', 'dream_art');
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    render(frames) {
        frames.forEach((frame, index) => {
            const canvas = createCanvas(800, 600); // 800x600 px
            const ctx = canvas.getContext('2d');

            // Background color based on reward (emotion)
            const intensity = Math.min(255, Math.floor(frame.reward * 255));
            ctx.fillStyle = `rgb(${intensity}, ${255 - intensity}, 150)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw a simple "scene object" for sight
            ctx.fillStyle = 'white';
            ctx.font = '40px Sans';
            ctx.fillText(frame.sight, 50, 100);

            // Draw sound as text
            ctx.font = '30px Sans';
            ctx.fillText(`Sound: ${frame.sound}`, 50, 200);

            // Draw reward/emotion as circle size
            ctx.beginPath();
            ctx.arc(400, 400, 50 + frame.reward * 50, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
            ctx.fill();

            // Save image
            const filePath = path.join(this.outputDir, `frame_${index + 1}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filePath, buffer);

            console.log(`Rendered art: ${filePath}`);
        });
    }

    clear() {
        fs.rmSync(this.outputDir, { recursive: true, force: true });
        fs.mkdirSync(this.outputDir, { recursive: true });
    }
}
