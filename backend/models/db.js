// models/db.js — In-memory mock database (replace with real DB in production)

const { v4: uuid } = require("uuid");

const users = {
  "user_001": {
    id: "user_001",
    name: "Ramesh Kumar",
    phone: "+91-9876543210",
    language: "en-US",
    accountNumber: "XXXX-XXXX-4892",
    balance: 12450.00,
    pin: "1234", // Hashed in real system
    loan: { outstanding: 8500, emi: 850, nextDue: "2026-03-15" }
  }
};

const transactions = [
  { id: uuid(), userId: "user_001", type: "debit",  label: "Sent to Asha",        amount: 500,  date: new Date(Date.now() - 3*86400000) },
  { id: uuid(), userId: "user_001", type: "credit", label: "Salary received",     amount: 8000, date: new Date(Date.now() - 7*86400000) },
  { id: uuid(), userId: "user_001", type: "debit",  label: "Electricity bill",    amount: 320,  date: new Date(Date.now() - 10*86400000) },
  { id: uuid(), userId: "user_001", type: "debit",  label: "Grocery",             amount: 210,  date: new Date(Date.now() - 12*86400000) },
  { id: uuid(), userId: "user_001", type: "credit", label: "Govt. subsidy credit",amount: 1200, date: new Date(Date.now() - 20*86400000) },
];

const contacts = [
  { id: uuid(), userId: "user_001", name: "Asha",   phone: "+91-9111111111", account: "XXXX-1234" },
  { id: uuid(), userId: "user_001", name: "Mohan",  phone: "+91-9222222222", account: "XXXX-5678" },
  { id: uuid(), userId: "user_001", name: "Priya",  phone: "+91-9333333333", account: "XXXX-9012" },
];

const savingsTips = [
  "Save at least 10% of every payment you receive — even small amounts add up over time.",
  "Avoid borrowing for non-essential items. Use your savings goal account first.",
  "Keep an emergency fund worth 3 months of expenses in your savings account.",
  "Compare prices before making large purchases. Small savings on each item matter.",
  "Set a weekly spending limit and track your expenses using voice commands here."
];

module.exports = { users, transactions, contacts, savingsTips, uuid };
