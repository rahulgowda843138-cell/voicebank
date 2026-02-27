// app.js — Main application controller

// ─── DOM References ──────────────────────────────────────────────────────────
const micBtn        = document.getElementById("micBtn");
const pulseRing     = document.getElementById("pulseRing");
const transcriptText= document.getElementById("transcriptText");
const responseSection = document.getElementById("responseSection");
const responseIcon  = document.getElementById("responseIcon");
const responseText  = document.getElementById("responseText");
const actionButtons = document.getElementById("actionButtons");
const balanceCard   = document.getElementById("balanceCard");
const historyPanel  = document.getElementById("historyPanel");
const txnList       = document.getElementById("txnList");
const tipsPanel     = document.getElementById("tipsPanel");
const tipText       = document.getElementById("tipText");

// ─── State ───────────────────────────────────────────────────────────────────
let holding = false;
let pendingTransfer = null;

// ─── Voice Init ───────────────────────────────────────────────────────────────
Voice.init(
  (text, isFinal) => {
    transcriptText.textContent = text;
    if (isFinal) processCommand(text.toLowerCase());
  },
  (err) => {
    transcriptText.textContent = "Mic error: " + err + ". Using tap mode.";
    stopListening();
  },
  () => {
    transcriptText.textContent = t("listening");
  },
  () => { stopListening(); }
);

// ─── Mic Button Events ────────────────────────────────────────────────────────
micBtn.addEventListener("mousedown",  startListening);
micBtn.addEventListener("touchstart", e => { e.preventDefault(); startListening(); });
micBtn.addEventListener("mouseup",    stopListening);
micBtn.addEventListener("touchend",   stopListening);
micBtn.addEventListener("mouseleave", stopListening);

function startListening() {
  holding = true;
  micBtn.classList.add("listening");
  pulseRing.classList.add("active");
  if (Voice.isSupported()) {
    Voice.start(currentLang);
  } else {
    // Fallback: type command
    transcriptText.textContent = "Speech not supported. Use quick buttons below.";
  }
}

function stopListening() {
  if (!holding) return;
  holding = false;
  micBtn.classList.remove("listening");
  pulseRing.classList.remove("active");
  Voice.stop();
}

// ─── Quick Action Tap ─────────────────────────────────────────────────────────
function simulateCommand(cmd) {
  transcriptText.textContent = cmd;
  processCommand(cmd.toLowerCase());
}

// ─── Command Parser ───────────────────────────────────────────────────────────
function processCommand(text) {
  hideAll();

  if (matchAny(text, ["balance", "bakiye", "salio", "solde", "शेष", "बैलेंस"])) {
    showBalance();
  } else if (matchAny(text, ["history", "transactions", "statement", "miamala", "लेनदेन", "historique"])) {
    showHistory();
  } else if (matchAny(text, ["send", "transfer", "tuma", "भेजो", "envoyer", "enviar"])) {
    handleSend(text);
  } else if (matchAny(text, ["bill", "pay", "payment", "lipa", "बिल", "payer"])) {
    handleBill(text);
  } else if (matchAny(text, ["tip", "tips", "saving", "advice", "सुझाव", "conseil"])) {
    showTip();
  } else if (matchAny(text, ["loan", "emi", "borrow", "mkopo", "ऋण", "prêt"])) {
    showLoan();
  } else {
    showResponse("❓", t("unknown"), []);
    Voice.speak(t("unknown"), currentLang);
  }
}

function matchAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

// ─── Actions ─────────────────────────────────────────────────────────────────

function showBalance() {
  balanceCard.hidden = false;
  document.getElementById("savingsAmt").textContent = "₹ " + mockUser.balance.toLocaleString("en-IN");
  document.getElementById("lastTxn").textContent =
    `₹ ${mockUser.transactions[0].amount} ${mockUser.transactions[0].label} (${mockUser.transactions[0].date})`;

  const msg = `${t("balance")} ₹ ${mockUser.balance.toLocaleString("en-IN")}`;
  showResponse("💰", msg, []);
  Voice.speak(msg, currentLang);
}

function showHistory() {
  historyPanel.hidden = false;
  txnList.innerHTML = "";
  mockUser.transactions.forEach(txn => {
    const li = document.createElement("li");
    li.className = `txn-item ${txn.type}`;
    li.innerHTML = `
      <span class="txn-label">🗓 ${txn.label}<br/><small>${txn.date}</small></span>
      <span class="txn-amount">${txn.type === "credit" ? "+" : "-"}₹${txn.amount}</span>
    `;
    txnList.appendChild(li);
  });
  responseSection.hidden = true;
  Voice.speak(`You have ${mockUser.transactions.length} recent transactions.`, currentLang);
}

function handleSend(text) {
  // Try to detect contact name and amount from text
  let contact = contacts.find(c => text.toLowerCase().includes(c.name.toLowerCase()));
  let amountMatch = text.match(/\d+/);
  let amount = amountMatch ? parseInt(amountMatch[0]) : null;

  if (!contact) contact = contacts[0]; // Default
  if (!amount) amount = 100;

  pendingTransfer = { contact, amount };

  const msg = `Send ₹${amount} ${t("to")} ${contact.name}?`;
  showResponse("📤", msg, [
    { label: t("confirm"), cls: "btn-confirm", action: confirmSend },
    { label: t("cancel"),  cls: "btn-cancel",  action: cancelAction }
  ]);
  Voice.speak(msg, currentLang);
}

function confirmSend() {
  if (!pendingTransfer) return;
  const { contact, amount } = pendingTransfer;
  mockUser.balance -= amount;
  mockUser.transactions.unshift({
    id: Date.now(), type: "debit",
    label: `Sent to ${contact.name}`, amount, date: "just now"
  });
  const msg = `${t("sent")} ₹${amount} ${t("to")} ${contact.name} ✅`;
  showResponse("✅", msg, []);
  Voice.speak(msg, currentLang);
  pendingTransfer = null;
}

function handleBill(text) {
  const msg = "Pay ₹320 to Electricity Board?";
  showResponse("🧾", msg, [
    { label: t("confirm"), cls: "btn-confirm", action: () => {
        mockUser.balance -= 320;
        showResponse("✅", "Bill paid successfully!", []);
        Voice.speak("Bill paid successfully!", currentLang);
      }
    },
    { label: t("cancel"), cls: "btn-cancel", action: cancelAction }
  ]);
  Voice.speak(msg, currentLang);
}

function showTip() {
  const tip = mockUser.savingsTips[Math.floor(Math.random() * mockUser.savingsTips.length)];
  tipsPanel.hidden = false;
  tipText.textContent = tip;
  responseSection.hidden = true;
  Voice.speak(tip, currentLang);
}

function showLoan() {
  const loan = mockUser.loan;
  const msg = `${t("loan")}: ₹${loan.outstanding}. EMI: ₹${loan.emi}. Next due: ${loan.nextDue}`;
  showResponse("🏷️", msg, []);
  Voice.speak(msg, currentLang);
}

function cancelAction() {
  showResponse("❌", "Action cancelled.", []);
  pendingTransfer = null;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function showResponse(icon, text, buttons) {
  responseSection.hidden = false;
  responseIcon.textContent = icon;
  responseText.textContent = text;
  actionButtons.innerHTML = "";
  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.className = btn.cls;
    b.textContent = btn.label;
    b.onclick = btn.action;
    actionButtons.appendChild(b);
  });
}

function hideAll() {
  responseSection.hidden = true;
  balanceCard.hidden      = true;
  historyPanel.hidden     = true;
  tipsPanel.hidden        = true;
}
