#!/bin/bash

# --- Termux-ready QBLS Phase 2+3 Setup Script ---

echo "Starting QBLS Phase 2+3 setup..."

# Ensure we're in ~/qbls
cd ~/qbls || exit

# 1. Remove any stray nested folder
if [ -d "qbls" ]; then
    rm -rf qbls
    echo "Removed nested qbls folder."
fi

# 2. Create folder structure
mkdir -p src/memory src/neurotransmitters src/neurons src/regions src/body
echo "Folder structure created."

# 3. Create Phase 2+3 files

# MemoryStore.js
cat > src/memory/MemoryStore.js << 'EOF'
export class MemoryStore {
  constructor() {
    this.shortTerm = [];
    this.longTerm = [];
  }

  addShortTerm(memory) {
    this.shortTerm.push(memory);
    if (this.shortTerm.length > 50) this.shortTerm.shift();
  }

  addLongTerm(memory) {
    this.longTerm.push(memory);
  }

  snapshot() {
    return {
      shortTerm: [...this.shortTerm],
      longTerm: [...this.longTerm]
    };
  }
}
EOF

# ShortTerm.js
cat > src/memory/ShortTerm.js << 'EOF'
export class ShortTermMemory {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  encode(event) {
    this.memoryStore.addShortTerm({
      event,
      timestamp: Date.now()
    });
  }
}
EOF

# LongTerm.js
cat > src/memory/LongTerm.js << 'EOF'
export class LongTermMemory {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  consolidate(shortTermSnapshot) {
    shortTermSnapshot.forEach(memory => {
      this.memoryStore.addLongTerm({
        ...memory,
        weight: Math.random() // placeholder for emotional impact
      });
    });
  }
}
EOF

# Serotonin.js
cat > src/neurotransmitters/Serotonin.js << 'EOF'
export class Serotonin {
  constructor(state) {
    this

