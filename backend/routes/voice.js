// routes/voice.js — Voice command NLP & intent router

const express  = require("express");
const router   = express.Router();
const { users, transactions, savingsTips } = require("../models/db");

// ─── Intent Detection ─────────────────────────────────────────────────────────
const intents = [
  { name: "CHECK_BALANCE",  keywords: ["balance", "bakiye", "salio", "solde", "शेष", "बैलेंस", "how much"] },
  { name: "SEND_MONEY",     keywords: ["send", "transfer", "tuma", "भेजो", "envoyer", "enviar"] },
  { name: "TRANSACTION_HISTORY", keywords: ["history", "transactions", "statement", "miamala", "लेनदेन"] },
  { name: "PAY_BILL",       keywords: ["bill", "pay", "payment", "lipa", "बिल", "payer"] },
  { name: "SAVINGS_TIPS",   keywords: ["tip", "tips", "saving", "advice", "सुझाव", "conseil"] },
  { name: "LOAN_STATUS",    keywords: ["loan", "emi", "borrow", "mkopo", "ऋण", "prêt"] },
];

function detectIntent(text) {
  const lower = text.toLowerCase();
  for (const intent of intents) {
    if (intent.keywords.some(k => lower.includes(k))) {
      return intent.name;
    }
  }
  return "UNKNOWN";
}

function extractAmount(text) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

function extractName(text, users) {
  // Very simple: check for known contact names
  const names = ["asha", "mohan", "priya", "suresh"];
  for (const name of names) {
    if (text.toLowerCase().includes(name)) return capitalize(name);
  }
  return null;
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ─── POST /api/voice/command ──────────────────────────────────────────────────
// Body: { userId, transcript, language }
router.post("/command", (req, res) => {
  const { userId = "user_001", transcript, language = "en-US" } = req.body;

  if (!transcript) return res.status(400).json({ error: "Transcript required" });

  const user   = users[userId];
  if (!user)   return res.status(404).json({ error: "User not found" });

  const intent = detectIntent(transcript);
  let response = {};

  switch (intent) {

    case "CHECK_BALANCE":
      response = {
        intent,
        speak: `Your balance is ₹${user.balance.toLocaleString("en-IN")}`,
        data:  { balance: user.balance, currency: "INR" }
      };
      break;

    case "SEND_MONEY": {
      const amount  = extractAmount(transcript) || 100;
      const contact = extractName(transcript) || "Asha";
      response = {
        intent,
        speak:  `Send ₹${amount} to ${contact}? Say confirm or cancel.`,
        data:   { amount, contact, requiresConfirmation: true }
      };
      break;
    }

    case "TRANSACTION_HISTORY": {
      const recentTxns = transactions
        .filter(t => t.userId === userId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      response = {
        intent,
        speak: `You have ${recentTxns.length} recent transactions. Last: ${recentTxns[0]?.label}`,
        data:  { transactions: recentTxns }
      };
      break;
    }

    case "PAY_BILL":
      response = {
        intent,
        speak: "Pay ₹320 electricity bill? Say confirm or cancel.",
        data:  { amount: 320, billType: "Electricity", requiresConfirmation: true }
      };
      break;

    case "SAVINGS_TIPS": {
      const tip = savingsTips[Math.floor(Math.random() * savingsTips.length)];
      response = { intent, speak: tip, data: { tip } };
      break;
    }

    case "LOAN_STATUS":
      response = {
        intent,
        speak: `Your loan outstanding is ₹${user.loan.outstanding}. EMI is ₹${user.loan.emi}. Next due on ${user.loan.nextDue}.`,
        data:  user.loan
      };
      break;

    default:
      response = {
        intent: "UNKNOWN",
        speak: "Sorry, I did not understand. Please try again.",
        data:  {}
      };
  }

  res.json({ success: true, response });
});

// GET /api/voice/tips — Random savings tip
router.get("/tips", (req, res) => {
  const tip = savingsTips[Math.floor(Math.random() * savingsTips.length)];
  res.json({ success: true, tip });
});

module.exports = router;
