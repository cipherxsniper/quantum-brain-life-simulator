export class DreamArtSimulator {
    constructor() {
        this.frames = [];
    }

    // Render a single dream frame as ASCII art + description
    render(frame, frameNumber) {
        this.frames.push(frame);

        // Basic visual representation using symbols
        let art = '';
        switch (frame.sight) {
            case 'tree':
                art = `
        🌳
       🌿🌿
      🌿🌿🌿
      ||||
      ||||
                `;
                break;
            case 'river':
                art = `
        ~~~~~~~
      ~~~~~~~~~~
    ~~~~~~~~~~~~~
        ||  ||
                `;
                break;
            case 'mountain':
                art = `
          /\\
         /  \\
        /    \\
       /      \\
      /________\\
                `;
                break;
            default:
                art = `[Unknown scene: ${frame.sight}]`;
        }

        console.log(`🎨 Frame ${frameNumber}: ${frame.sight} scene with sound '${frame.sound}' and emotion ${frame.reward}`);
        console.log(art);
        console.log('-----------------------------');
    }

    // Clear all frames if needed
    clear() {
        this.frames = [];
    }
}
