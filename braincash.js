#!/usr/bin/env node

/**
 * Terminal → CashApp Transaction Simulator (Educational Only)
 * ----------------------------------------------------------
 * Features:
 * - Append-only ledger
 * - Derived balances
 * - Transaction state machine
 * - Risk threshold / automatic reversals
 * - Idempotency key support
 */

const fs = require("fs");
const crypto = require("crypto");

const LEDGER_FILE = "./ledger.json";
const IDEMPOTENCY_FILE = "./idempotency.json";

const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

/* ---------------- HELPERS ---------------- */
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
    if (tx.state === "reversed") {
      balances[tx.from] = (balances[tx.from] || 0) + tx.amount;
      balances[tx.to] = (balances[tx.to] || 0) - tx.amount;
    }
  }
  return balances;
}

/* ---------------- PAYMENT FLOW ---------------- */
const STATES = {
  CREATED: "created",
  AUTHORIZED: "authorized",
  PENDING: "pending",
  COMPLETED: "completed",
  REVERSED: "reversed"
};

function assertTransition(from, to) {
  const allowed = {
    created: ["authorized"],
    authorized: ["pending", "reversed"],
    pending: ["completed", "reversed"],
    completed: [],
    reversed: []
  };
  if (!allowed[from]?.includes(to)) {
    throw new Error(`Invalid transition ${from} → ${to}`);
  }
}

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

function processTransaction(tx) {
  assertTransition(tx.state, STATES.AUTHORIZED);
  tx.state = STATES.AUTHORIZED;
  tx.timeline.push({ state: STATES.AUTHORIZED, at: now() });

  assertTransition(tx.state, STATES.PENDING);
  tx.state = STATES.PENDING;
  tx.timeline.push({ state: STATES.PENDING, at: now() });

  // Risk logic: amounts over 3000 get automatically reversed
  else {
    assertTransition(tx.state, STATES.COMPLETED);
    tx.state = STATES.COMPLETED;
    tx.timeline.push({ state: STATES.COMPLETED, at: now() });
  }

  return tx;
}

/* ---------------- RUN ---------------- */
(function run() {
  const from = "$ThomasHarvey23";
  const to = "$ThomasHarvey2";
  const amount = 5000; // fixed as requested
  const idemKey = defined; // optional idempotency

  const ledger = load(LEDGER_FILE, []);

  let tx = createTransaction({ from, to, amount, idemKey });
  tx = processTransaction(tx);

  ledger.push(tx);
  save(LEDGER_FILE, ledger);

  console.log("📲 Transaction processed:");
  console.log(tx);

  console.log("\n💰 Derived balances:");
  console.log(deriveBalances(ledger));
})();
