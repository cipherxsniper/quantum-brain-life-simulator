#!/usr/bin/env node

/**
 * Terminal → CashApp Transaction Simulator
 * Each run:
 * 1. Creates a transaction
 * 2. Simulates processing
 * 3. Writes it to transactions.json
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_FILE = path.join(__dirname, "transactions.json");

/* ---------- helpers ---------- */

function nowISO() {
  return new Date().toISOString();
}

function generateTxId() {
  return "tx_" + crypto.randomUUID().slice(0, 8);
}

function loadTransactions() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveTransactions(txs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(txs, null, 2));
}

function simulateStatus() {
  const outcomes = ["completed", "failed"];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
}

/* ---------- main transaction logic ---------- */

function createTransaction({
  from = "terminal_user",
  to = "cashapp_user",
  amount = 25.50
}) {
  return {
    id: generateTxId(),
    from,
    to,
    amount,
    status: "pending",
    timestamp: nowISO()
  };
}

function processTransaction(tx) {
  // simulate network / payment delay
  const finalStatus = simulateStatus();

  return {
    ...tx,
    status: finalStatus,
    processed_at: nowISO()
  };
}

/* ---------- run ---------- */

(function run() {
  const tx = createTransaction({
    from: process.argv[2] || "terminal_user",
    to: process.argv[3] || "cashapp_user",
    amount: Number(process.argv[4]) || 25.50
  });

  console.log("Initiating transaction:", tx);

  const completedTx = processTransaction(tx);

  const transactions = loadTransactions();
  transactions.push(completedTx);
  saveTransactions(transactions);

  console.log("Transaction recorded:", completedTx);
})();
