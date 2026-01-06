import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

export class DreamArtSimulator {
    constructor() {
        this.outputDir = path.join(process.env.HOME, 'qbls', 'art_output');
        if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Map sound to dreamy color palettes
    soundPalette(sound) {
        const palettes = {
            birds: ['#FFFA8D', '#FFD700', '#FF8C00'],     // golden, warm
            wind: ['#C1EFFF', '#87CEEB', '#4682B4'],      // soft blues
            waterfall: ['#B0E0E6', '#1E90FF', '#104E8B'],// deep blues
            default: ['#FFFFFF', '#CCCCCC', '#999999']
        };
        return palettes[sound] || palettes.default;
    }

    // Generate random gradient stops
    randomGradient(ctx, width, height, palette) {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        for (let i = 0; i < palette.length; i++) {
            grad.addColorStop(Math.random(), palette[i]);
        }
        return grad;
    }

    // Emotion controls swirl intensity
    swirlIntensity(reward) {
        return 20 + reward * 80;
    }

    drawSwirls(ctx, width, height, reward, palette) {
        const numSwirls = 3 + Math.floor(reward * 7);
        for (let i = 0; i < numSwirls; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 100 + 50;
            const angleOffset = Math.random() * Math.PI * 2;

            ctx.strokeStyle = palette[Math.floor(Math.random() * palette.length)];
            ctx.lineWidth = 1 + reward * 4;
            ctx.beginPath();

            for (let t = 0; t < Math.PI * 2; t += 0.01) {
                const r = radius * Math.sin(t * 3 + angleOffset) * Math.cos(t * 2);
                const px = x + r * Math.cos(t);
                const py = y + r * Math.sin(t);
                if (t === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
    }

    async renderFrame(frame, index) {
        const width = 1000;
        const height = 800;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Create dreamy background
        const palette = this.soundPalette(frame.sound);
        ctx.fillStyle = this.randomGradient(ctx, width, height, palette);
        ctx.fillRect(0, 0, width, height);

        // Add swirls
        this.drawSwirls(ctx, width, height, frame.reward, palette);

        // Optional: Overlay faint shapes for sight (abstracted)
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = palette[1];
        switch(frame.sight) {
            case 'tree':
                ctx.beginPath();
                ctx.moveTo(width/2, height/2 - 150);
                ctx.lineTo(width/2 - 100, height/2 + 100);
                ctx.lineTo(width/2 + 100, height/2 + 100);
                ctx.closePath();
                ctx.fill();
                break;
            case 'river':
                ctx.beginPath();
                ctx.ellipse(width/2, height/2, 400, 100, Math.PI/4, 0, Math.PI*2);
                ctx.fill();
                break;
            case 'mountain':
                ctx.beginPath();
                ctx.moveTo(width/4, height/2 + 150);
                ctx.lineTo(width/2, height/2 - 150);
                ctx.lineTo(3*width/4, height/2 + 150);
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.globalAlpha = 1;

        // Save frame as PNG
        const filePath = path.join(this.outputDir, `dream_${index + 1}.png`);
        fs.writeFileSync(filePath, canvas.toBuffer('image/png'));
        console.log(`✨ Saved dream frame ${index + 1} → ${filePath}`);
    }

    async render(frames) {
        for (let i = 0; i < frames.length; i++) {
            await this.renderFrame(frames[i], i);
        }
    }

    clear() {
        if (fs.existsSync(this.outputDir)) {
            fs.readdirSync(this.outputDir).forEach(file => fs.unlinkSync(path.join(this.outputDir, file)));
            console.log('Cleared old dream frames.');
        }
    }
}
