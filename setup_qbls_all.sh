#!/bin/bash
# --- Termux-ready QBLS Phase 5 Setup Script ---

echo "Starting QBLS Phase 5 setup (Dopamine + Reward + Learning Loops)..."

cd ~/qbls || exit

# Create Phase 5 folders
mkdir -p src/learning
echo "Phase 5 folders created."

# -------------------------------
# Dopamine.js
# -------------------------------
cat > src/neurotransmitters/Dopamine.js << 'EOF'
export class Dopamine {
  constructor(state) {
    this.state = state;
    this.level = 0.5; // 0-1 baseline
  }

  spike(amount) {
    this.level = Math.max(0, Math.min(1, this.level + amount));
    this.state.neurotransmitters.dopamine = this.level;
  }

  decay() {
    this.level *= 0.98; // gradual decay
    this.state.neurotransmitters.dopamine = this.level;
  }
}
EOF

# -------------------------------
# RewardSystem.js
# -------------------------------
cat > src/learning/RewardSystem.js << 'EOF'
export class RewardSystem {
  constructor(state, dopamine) {
    this.state = state;
    this.dopamine = dopamine;
  }

  trigger(eventValue) {
    // eventValue: 0-1 scale
    this.dopamine.spike(eventValue);
    if(this.state.memoryStore) {
      // Weight memories based on dopamine
      const shortTermSnapshot = this.state.memoryStore.snapshot().shortTerm;
      shortTermSnapshot.forEach(mem => mem.weight = this.dopamine.level);
    }
  }
}
EOF

# -------------------------------
# LearningLoop.js
# -------------------------------
cat > src/learning/LearningLoop.js << 'EOF'
export class LearningLoop {
  constructor(state) {
    this.state = state;
  }

  consolidate() {
    if(this.state.memoryStore) {
      const longTerm = new (require('../memory/LongTerm.js').LongTermMemory)(this.state.memoryStore);
      const snapshot = this.state.memoryStore.snapshot().shortTerm;
      longTerm.consolidate(snapshot);
    }
  }
}
EOF

echo "Phase 5 files created."

# -------------------------------
# Commit & push
# -------------------------------
git add .
git commit -m "Phase 5: dopamine, reward system, learning loops"
git push

echo "QBLS Phase 5 setup complete and pushed to GitHub."
