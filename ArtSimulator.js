import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

export class ArtSimulator {
    constructor() {
        this.outputDir = path.join(process.env.HOME, 'qbls', 'art_output');
        if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });
    }

    async renderFrame(frame, index) {
        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, width, height);

        // Draw a simple visual based on dream frame
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px Sans';
        ctx.fillText(frame.sight, 50, 100);

        ctx.font = '30px Sans';
        ctx.fillText(`Sound: ${frame.sound}`, 50, 200);
        ctx.fillText(`Emotion: ${frame.reward}`, 50, 300);

        // Save image
        const filePath = path.join(this.outputDir, `frame_${index + 1}.png`);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved frame ${index + 1} to ${filePath}`);
    }

    async render(frames) {
        for (let i = 0; i < frames.length; i++) {
            await this.renderFrame(frames[i], i);
        }
    }

    clear() {
        // Optional: delete previous frames
        if (fs.existsSync(this.outputDir)) {
            fs.readdirSync(this.outputDir).forEach(file => fs.unlinkSync(path.join(this.outputDir, file)));
            console.log('Cleared old frames.');
        }
    }
}
