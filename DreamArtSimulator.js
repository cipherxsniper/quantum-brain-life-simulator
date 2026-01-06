import fs from 'fs';
import path from 'path';
import chalk from 'chalk'; // for colored console output

export class DreamArtSimulator {
    constructor() {
        this.frames = [];
        this.outputDir = './dream_art_frames';
        if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir);
    }

    async render(dreamFrames) {
        this.frames = dreamFrames;

        console.log(chalk.cyan('\n--- Rendering Dream Art ---\n'));

        for (let i = 0; i < dreamFrames.length; i++) {
            const frame = dreamFrames[i];
            const { sight, sound, reward, thought, layerColor } = frame;

            // Console output for visualization
            const colorFunc = chalk.hex(layerColor || '#FFFFFF');
            console.log(colorFunc(`🎨 Frame ${i + 1}: ${sight} scene with sound '${sound}' and emotion ${reward}`));
            console.log(colorFunc(`💭 Thought: ${thought}\n`));

            // Save as JSON file for each frame
            const fileName = path.join(this.outputDir, `frame_${i + 1}.json`);
            fs.writeFileSync(fileName, JSON.stringify(frame, null, 2), 'utf-8');
        }

        console.log(chalk.green(`All ${dreamFrames.length} frames rendered to console and saved in ${this.outputDir}`));
    }

    clear() {
        this.frames = [];
    }
}
