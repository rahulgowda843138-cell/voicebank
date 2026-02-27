// routes/transactions.js — Transaction endpoints

const express = require("express");
const router  = express.Router();
const { users, transactions, contacts, uuid } = require("../models/db");

// GET /api/transactions/:userId — Get transaction history
router.get("/:userId", (req, res) => {
  const limit  = parseInt(req.query.limit) || 10;
  const userTxns = transactions
    .filter(t => t.userId === req.params.userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

  res.json({ success: true, data: userTxns, count: userTxns.length });
});

// POST /api/transactions/send — Send money
router.post("/send", (req, res) => {
  const { userId, toContact, amount } = req.body;

  if (!userId || !toContact || !amount)
    return res.status(400).json({ error: "userId, toContact, and amount are required" });

  const sender = users[userId];
  if (!sender) return res.status(404).json({ error: "User not found" });

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0)
    return res.status(400).json({ error: "Invalid amount" });

  if (sender.balance < parsedAmount)
    return res.status(400).json({ error: "Insufficient balance" });

  // Deduct balance
  sender.balance -= parsedAmount;

  // Record transaction
  const txn = {
    id:     uuid(),
    userId,
    type:   "debit",
    label:  `Sent to ${toContact}`,
    amount: parsedAmount,
    date:   new Date()
  };
  transactions.unshift(txn);

  res.json({
    success: true,
    message: `₹${parsedAmount} sent to ${toContact}`,
    data: {
      transactionId: txn.id,
      newBalance:    sender.balance,
      timestamp:     txn.date
    }
  });
});

// POST /api/transactions/pay-bill — Pay a bill
router.post("/pay-bill", (req, res) => {
  const { userId, billType, amount } = req.body;

  if (!userId || !billType || !amount)
    return res.status(400).json({ error: "userId, billType, and amount are required" });

  const user = users[userId];
  if (!user) return res.status(404).json({ error: "User not found" });

  const parsedAmount = parseFloat(amount);
  if (user.balance < parsedAmount)
    return res.status(400).json({ error: "Insufficient balance" });

  user.balance -= parsedAmount;

  const txn = {
    id:     uuid(),
    userId,
    type:   "debit",
    label:  `${billType} Bill Payment`,
    amount: parsedAmount,
    date:   new Date()
  };
  transactions.unshift(txn);

  res.json({
    success: true,
    message: `${billType} bill of ₹${parsedAmount} paid successfully`,
    data: { transactionId: txn.id, newBalance: user.balance }
  });
});

module.exports = router;
