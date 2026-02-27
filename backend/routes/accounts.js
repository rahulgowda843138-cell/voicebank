// routes/accounts.js — Account endpoints

const express = require("express");
const router  = express.Router();
const { users, contacts } = require("../models/db");

// GET /api/accounts/:userId — Get account details + balance
router.get("/:userId", (req, res) => {
  const user = users[req.params.userId];
  if (!user) return res.status(404).json({ error: "User not found" });

  const { pin, ...safeUser } = user; // Never return PIN
  res.json({ success: true, data: safeUser });
});

// GET /api/accounts/:userId/balance — Get balance only
router.get("/:userId/balance", (req, res) => {
  const user = users[req.params.userId];
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    success: true,
    data: {
      balance: user.balance,
      accountNumber: user.accountNumber,
      currency: "INR"
    }
  });
});

// GET /api/accounts/:userId/contacts — Get saved contacts
router.get("/:userId/contacts", (req, res) => {
  const userContacts = contacts.filter(c => c.userId === req.params.userId);
  res.json({ success: true, data: userContacts });
});

// PATCH /api/accounts/:userId/language — Update preferred language
router.patch("/:userId/language", (req, res) => {
  const user = users[req.params.userId];
  if (!user) return res.status(404).json({ error: "User not found" });

  const { language } = req.body;
  if (!language) return res.status(400).json({ error: "Language required" });

  user.language = language;
  res.json({ success: true, message: "Language updated", language });
});

module.exports = router;
