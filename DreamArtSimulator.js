// ~/qbls/src/visualization/DreamArtSimulator.js
import chalk from 'chalk'; // for colors in terminal

export class DreamArtSimulator {
    constructor() {
        this.frames = [];
    }

    // Render the dream frames in sequence
    async render(dreamFrames) {
        console.log(chalk.green('\n🌙 Rendering your dream art...\n'));
        this.frames = dreamFrames;

        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            this.displayFrame(i + 1, frame);
            await this.sleep(1000); // 1 second pause between frames
        }
        console.log(chalk.green('\n✨ Dream rendering complete!\n'));
    }

    // Display a single frame with ASCII/emoji visualization
    displayFrame(index, frame) {
        const { sight, sound, reward } = frame;

        let sightArt = '';
        switch (sight.toLowerCase()) {
            case 'tree':
                sightArt = '🌳🌿🌳';
                break;
            case 'river':
                sightArt = '🌊💧🌊';
                break;
            case 'mountain':
                sightArt = '⛰️🏔️⛰️';
                break;
            default:
                sightArt = '✨';
        }

        let soundEmoji = '';
        switch (sound.toLowerCase()) {
            case 'birds':
                soundEmoji = '🐦🎶';
                break;
            case 'wind':
                soundEmoji = '🌬️🍃';
                break;
            case 'waterfall':
                soundEmoji = '💦🌊';
                break;
            default:
                soundEmoji = '🎵';
        }

        const emotionLevel = Math.round(reward * 10); // scale reward to 0-10
        const emotionBar = '❤️'.repeat(emotionLevel);

        console.log(chalk.blue(`🎨 Frame ${index}:`));
        console.log(chalk.yellow(`${sightArt} | ${soundEmoji} | Emotion: ${emotionBar}\n`));
    }

    // Simple async sleep for animation timing
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
