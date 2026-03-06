#!/data/data/com.termux/files/usr/bin/bash

# ------------------------------
# Quantum Brain Life Simulator - Full Termux Run
# ------------------------------

# 1️⃣ Install required packages
pkg update -y && pkg upgrade -y
pkg install -y git nodejs nano

# 2️⃣ Clone repo if not already present
REPO_DIR="$HOME/quantum-brain-life-simulator"
if [ ! -d "$REPO_DIR" ]; then
    git clone https://github.com/cipherxsniper/quantum-brain-life-simulator.git $REPO_DIR
fi

cd $REPO_DIR

# 3️⃣ Install Node.js dependencies
npm install

# 4️⃣ Create Phase Runner Script
cat > run_all_phases.mjs << 'EOF'
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// List of phase files
const phases = [
    'run_sleep_phase7.mjs',
    'run_sleep_phase8.mjs',
    'run_sleep_phase9.mjs'
];

phases.forEach((phaseFile) => {
    console.log(`\n=== Running ${phaseFile} ===`);

    const phasePath = path.join(process.cwd(), phaseFile);

    // Load the module dynamically
    import(phasePath).then((module) => {
        // Check if it exports SelfAwareAgent
        const AgentClass = module.default;
        if (!AgentClass) {
            console.log(`⚠️ No default export in ${phaseFile}, skipping...`);
            return;
        }

        const agent = new AgentClass(2048);
        const TOTAL_TICKS = 50;

        for (let tick = 0; tick < TOTAL_TICKS; tick++) {
            const state = agent.update({}, { success: Math.random() < 0.5 ? 1 : 0 });
            console.log(`🧠 [${phaseFile}] Tick ${tick}:`, state);
        }

        const logFile = phaseFile.replace('.mjs', '_thought_log.json');
        agent.exportThoughtLog(logFile);
        console.log(`✅ ${phaseFile} complete. Thought log saved to ${logFile}`);
    });
});
EOF

# 5️⃣ Run all phases
node run_all_phases.mjs
