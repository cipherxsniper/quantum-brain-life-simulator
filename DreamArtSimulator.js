import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

export class DreamArtSimulator {
    constructor(outputDir = './output/dream_frames') {
        this.outputDir = outputDir;
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    async render(frames) {
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            const canvas = createCanvas(800, 600);
            const ctx = canvas.getContext('2d');

            // Background color based on emotion/reward
            const colorValue = Math.floor(frame.reward * 255);
            ctx.fillStyle = `rgb(${colorValue}, ${255 - colorValue}, 150)`;
            ctx.fillRect(0, 0, 800, 600);

            // Text overlay for sight and sound
            ctx.fillStyle = 'black';
            ctx.font = '40px Sans';
            ctx.fillText(`Scene: ${frame.sight}`, 50, 200);
            ctx.fillText(`Sound: ${frame.sound}`, 50, 300);
            ctx.fillText(`Emotion: ${frame.reward}`, 50, 400);

            // Save to file
            const filePath = path.join(this.outputDir, `frame_${i + 1}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filePath, buffer);

            console.log(`Rendered art frame ${i + 1}: ${filePath}`);
        }
    }
}}
