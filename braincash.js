#!/usr/bin/env node

/**
 * BrainCash.js – Terminal CashApp Simulator (Educational Only)
 * -------------------------------------------------------------
 * Features:
 * - Append-only ledger
 * - Idempotency support
 * - Transaction state machine
 * - Derived balances
 * - Simulated network delay
 * - CLI input support
 */

import fs from "fs";
import crypto from "crypto";

// ---------- Files ----------
const LEDGER_FILE = "./ledger.json";
const IDEMPOTENCY_FILE = "./idempotency.json";

// ---------- Helpers ----------
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

function load(file, fallback = []) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function deriveBalances(ledger) {
  const balances = {};
  for (const tx of ledger) {
    if (tx.state === "completed") {
      balances[tx.from] = (balances[tx.from] || 0) - tx.amount;
      balances[tx.to] = (balances[tx.to] || 0) + tx.amount;
    }
  }
  return balances;
}

// ---------- Transaction States ----------
const STATES = {
  CREATED: "created",
  AUTHORIZED: "authorized",
  PENDING: "pending",
  COMPLETED: "completed"
};

function assertTransition(from, to) {
  const allowed = {
    created: ["authorized"],
    authorized: ["pending"],
    pending: ["completed"],
    completed: []
  };
  if (!allowed[from]?.includes(to)) {
    throw new Error(`Invalid state transition ${from} → ${to}`);
  }
}

// ---------- Transaction Logic ----------
function createTransaction({ from, to, amount, idemKey }) {
  const idempotencyMap = load(IDEMPOTENCY_FILE, {});
  if (idemKey && idempotencyMap[idemKey]) {
    console.log("♻️ Idempotent transaction detected");
    return idempotencyMap[idemKey];
  }

  const tx = {
    id: "tx_" + uuid().slice(0, 8),
    from,
    to,
    amount,
    state: STATES.CREATED,
    timeline: [{ state: STATES.CREATED, at: now() }]
  };

  if (idemKey) {
    idempotencyMap[idemKey] = tx;
    save(IDEMPOTENCY_FILE, idempotencyMap);
  }

  return tx;
}

async function processTransaction(tx) {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 500));

  assertTransition(tx.state, STATES.AUTHORIZED);
  tx.state = STATES.AUTHORIZED;
  tx.timeline.push({ state: STATES.AUTHORIZED, at: now() });

  await new Promise((r) => setTimeout(r, 500));

  assertTransition(tx.state, STATES.PENDING);
  tx.state = STATES.PENDING;
  tx.timeline.push({ state: STATES.PENDING, at: now() });

  await new Promise((r) => setTimeout(r, 500));

  assertTransition(tx.state, STATES.COMPLETED);
  tx.state = STATES.COMPLETED;
  tx.timeline.push({ state: STATES.COMPLETED, at: now() });

  return tx;
}

// ---------- Run ----------
async function main() {
  const args = process.argv.slice(2);
  const from = args[0] || "$ThomasHarvey23";
  const to = args[1] || "$ThomasHarvey2";
  const amount = Number(args[2] || 5000);
  const idemKey = args[3]; // optional

  const ledger = load(LEDGER_FILE, []);

  let tx = createTransaction({ from, to, amount, idemKey });
  tx = await processTransaction(tx);

  ledger.push(tx);
  save(LEDGER_FILE, ledger);

  console.log("📲 Transaction processed:");
  console.log(tx);

  console.log("\n💰 Derived balances:");
  console.log(deriveBalances(ledger));
}

main();
