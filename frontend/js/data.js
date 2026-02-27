// data.js — Mock financial data (simulates backend response)

const mockUser = {
  name: "Ramesh Kumar",
  accountNumber: "XXXX-XXXX-4892",
  balance: 12450.00,
  loan: { outstanding: 8500, emi: 850, nextDue: "15 March 2026" },
  transactions: [
    { id: 1, type: "debit",  label: "Sent to Asha",       amount: 500,  date: "3 days ago" },
    { id: 2, type: "credit", label: "Salary received",    amount: 8000, date: "7 days ago" },
    { id: 3, type: "debit",  label: "Electricity bill",   amount: 320,  date: "10 days ago" },
    { id: 4, type: "debit",  label: "Grocery – Local shop",amount: 210, date: "12 days ago" },
    { id: 5, type: "credit", label: "Govt. subsidy",      amount: 1200, date: "20 days ago" },
  ],
  savingsTips: [
    "Save at least 10% of every payment you receive — even small amounts add up over time.",
    "Avoid borrowing for non-essential items. Use your savings goal account first.",
    "Keep an emergency fund worth 3 months of expenses in your savings account.",
    "Compare prices before making large purchases. Small savings on each item matter.",
    "Set a weekly spending limit and track your expenses using voice commands here."
  ]
};

const contacts = [
  { name: "Asha",   account: "XXXX-1234" },
  { name: "Mohan",  account: "XXXX-5678" },
  { name: "Priya",  account: "XXXX-9012" },
  { name: "Suresh", account: "XXXX-3456" },
];
