import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

export class ArtSimulator {
    constructor() {
        this.outputDir = path.join(process.env.HOME, 'qbls', 'art_output');
        if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Map sound to a color
    soundColor(sound) {
        const mapping = {
            birds: '#FFD700', // golden
            wind: '#87CEEB',  // sky blue
            waterfall: '#1E90FF', // deep blue
            default: '#FFFFFF'
        };
        return mapping[sound] || mapping.default;
    }

    // Map emotion (reward) to intensity
    emotionBrightness(reward) {
        // reward 0–1 → brightness 50–255
        return Math.floor(50 + reward * 205);
    }

    async renderFrame(frame, index) {
        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Gradient background based on emotion
        const brightness = this.emotionBrightness(frame.reward);
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, `rgb(${brightness},${brightness},${brightness})`);
        grad.addColorStop(1, this.soundColor(frame.sound));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Draw shapes representing the scene
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;

        switch(frame.sight) {
            case 'tree':
                ctx.fillStyle = '#228B22'; // forest green
                ctx.beginPath();
                ctx.moveTo(width/2, height/2 - 100);
                ctx.lineTo(width/2 - 50, height/2 + 100);
                ctx.lineTo(width/2 + 50, height/2 + 100);
                ctx.closePath();
                ctx.fill();
                break;
            case 'river':
                ctx.fillStyle = '#1E90FF';
                ctx.beginPath();
                ctx.moveTo(0, height/2 + 50);
                ctx.bezierCurveTo(width/3, height/2 - 50, 2*width/3, height/2 + 50, width, height/2 - 30);
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();
                ctx.fill();
                break;
            case 'mountain':
                ctx.fillStyle = '#8B4513'; // brown
                ctx.beginPath();
                ctx.moveTo(width/4, height/2 + 100);
                ctx.lineTo(width/2, height/2 - 100);
                ctx.lineTo(3*width/4, height/2 + 100);
                ctx.closePath();
                ctx.fill();
                break;
            default:
                // Random colored circle for unknown sights
                ctx.fillStyle = this.soundColor(frame.sound);
                ctx.beginPath();
                ctx.arc(width/2, height/2, 80, 0, Math.PI*2);
                ctx.fill();
                break;
        }

        // Overlay frame text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '28px Sans';
        ctx.fillText(`Sight: ${frame.sight}`, 50, 50);
        ctx.fillText(`Sound: ${frame.sound}`, 50, 90);
        ctx.fillText(`Emotion: ${frame.reward}`, 50, 130);

        // Save as PNG
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
        if (fs.existsSync(this.outputDir)) {
            fs.readdirSync(this.outputDir).forEach(file => fs.unlinkSync(path.join(this.outputDir, file)));
            console.log('Cleared old frames.');
        }
    }
}    async render(frames) {
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
