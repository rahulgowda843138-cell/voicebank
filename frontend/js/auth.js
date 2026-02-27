// auth.js — Login, Register, PIN logic with security lockout

// ─── Mock User Database (localStorage simulates backend) ─────────────────────
const USERS_KEY   = "vb_users";
const SESSION_KEY = "vb_session";
const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 30;

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}
function saveSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

// Pre-load demo user
(function seedDemo() {
  const users = getUsers();
  if (!users["9876543210"]) {
    users["9876543210"] = {
      name: "Ramesh Kumar",
      phone: "9876543210",
      pin: hashPIN("1234"),
      attempts: 0,
      lockedUntil: null,
      createdAt: new Date().toISOString()
    };
    saveUsers(users);
  }
})();

// If already logged in, redirect to dashboard
if (getSession()) {
  window.location.href = "index.html";
}

// ─── Simple PIN Hash (use bcrypt in production) ───────────────────────────────
function hashPIN(pin) {
  // Simple obfuscation for demo; use proper hashing in production
  let hash = 0;
  const salt = "VB@2026#SALT";
  const str = pin + salt;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

// ─── Screen Navigation ────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".auth-screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  // Reset PIN state when switching screens
  resetPIN("login");
  resetPIN("set");
  resetPIN("confirm");
}

// ─── PIN STATE ────────────────────────────────────────────────────────────────
const pinState = {
  login:   { digits: [], max: 4 },
  set:     { digits: [], max: 4 },
  confirm: { digits: [], max: 4 },
};

function resetPIN(type) {
  pinState[type].digits = [];
  updateDots(type);
  const errorMap = { login: "pinError", set: null, confirm: "confirmPinError" };
  if (errorMap[type]) document.getElementById(errorMap[type])?.classList.add("hidden");
}

function updateDots(type) {
  const prefixMap = { login: "", set: "s", confirm: "c" };
  const prefix = prefixMap[type];
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`${prefix}dot${i}`);
    if (!dot) continue;
    dot.classList.remove("filled", "error");
    if (i < pinState[type].digits.length) dot.classList.add("filled");
  }
}

function addDigit(type, digit) {
  if (pinState[type].digits.length >= 4) return;
  pinState[type].digits.push(digit);
  updateDots(type);

  if (pinState[type].digits.length === 4) {
    setTimeout(() => handlePINComplete(type), 200);
  }
}

function deleteDigit(type) {
  pinState[type].digits.pop();
  updateDots(type);
}

function handlePINComplete(type) {
  const pin = pinState[type].digits.join("");
  if (type === "login")   verifyLoginPIN(pin);
  if (type === "set")     proceedToConfirmPIN(pin);
  if (type === "confirm") finalizeRegister(pin);
}

// ─── Build Numpad ─────────────────────────────────────────────────────────────
function buildNumpad(containerId, type) {
  const container = document.getElementById(containerId);
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  container.innerHTML = "";
  keys.forEach(k => {
    const btn = document.createElement("button");
    btn.className = "numpad-key";
    if (k === "") { btn.classList.add("empty"); btn.disabled = true; }
    else if (k === "⌫") { btn.classList.add("del"); btn.onclick = () => deleteDigit(type); }
    else { btn.onclick = () => addDigit(type, k); }
    btn.textContent = k;
    container.appendChild(btn);
  });
}

// Build all numpads on load
buildNumpad("loginNumpad",   "login");
buildNumpad("setNumpad",     "set");
buildNumpad("confirmNumpad", "confirm");

// ─── LOGIN FLOW ───────────────────────────────────────────────────────────────
let loginPhone = "";

function proceedToLoginPIN() {
  const phone = document.getElementById("loginPhone").value.trim();
  const err   = document.getElementById("loginPhoneError");

  if (!/^\d{10}$/.test(phone)) {
    err.classList.remove("hidden"); return;
  }
  err.classList.add("hidden");

  const users = getUsers();
  if (!users[phone]) {
    err.textContent = "No account found. Please register.";
    err.classList.remove("hidden"); return;
  }

  // Check if locked
  const user = users[phone];
  if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
    loginPhone = phone;
    startLockScreen(Math.ceil((new Date(user.lockedUntil) - new Date()) / 1000));
    return;
  }

  loginPhone = phone;
  resetPIN("login");
  showScreen("screenPIN");
}

function verifyLoginPIN(pin) {
  const users = getUsers();
  const user  = users[loginPhone];
  if (!user) return;

  const prefixMap = { login: "", set: "s", confirm: "c" };

  if (hashPIN(pin) === user.pin) {
    // Success
    user.attempts = 0;
    user.lockedUntil = null;
    saveUsers(users);
    saveSession({ phone: loginPhone, name: user.name, loginAt: new Date().toISOString() });
    showSuccessScreen(`Welcome back, ${user.name}! 👋`);
  } else {
    // Failed
    user.attempts = (user.attempts || 0) + 1;

    if (user.attempts >= MAX_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCK_SECONDS * 1000).toISOString();
      saveUsers(users);
      startLockScreen(LOCK_SECONDS);
    } else {
      saveUsers(users);
      const remaining = MAX_ATTEMPTS - user.attempts;
      showPINError("login", `Wrong PIN. ${remaining} attempt${remaining > 1 ? "s" : ""} left.`);
      resetPIN("login");
    }
  }
}

function showPINError(type, msg) {
  const prefixMap = { login: "", set: "s", confirm: "c" };
  const prefix = prefixMap[type];
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`${prefix}dot${i}`);
    if (dot) dot.classList.add("error");
  }
  const errMap = { login: "pinError", confirm: "confirmPinError" };
  if (errMap[type]) {
    const el = document.getElementById(errMap[type]);
    el.textContent = msg;
    el.classList.remove("hidden");
  }
  setTimeout(() => resetPIN(type), 800);
}

// ─── REGISTER FLOW ────────────────────────────────────────────────────────────
let newUserData = {};
let chosenPIN   = "";

function proceedToSetPIN() {
  const name  = document.getElementById("regName").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const err   = document.getElementById("regError");

  if (!name || !/^\d{10}$/.test(phone)) {
    err.textContent = "Enter a valid name and 10-digit phone number.";
    err.classList.remove("hidden"); return;
  }

  const users = getUsers();
  if (users[phone]) {
    err.textContent = "Account already exists. Please login.";
    err.classList.remove("hidden"); return;
  }

  err.classList.add("hidden");
  newUserData = { name, phone };
  resetPIN("set");
  showScreen("screenSetPIN");
}

function proceedToConfirmPIN(pin) {
  chosenPIN = pin;
  resetPIN("confirm");
  showScreen("screenConfirmPIN");
}

function finalizeRegister(pin) {
  if (pin !== chosenPIN) {
    showPINError("confirm", "PINs do not match. Try again.");
    return;
  }

  const users = getUsers();
  users[newUserData.phone] = {
    name:       newUserData.name,
    phone:      newUserData.phone,
    pin:        hashPIN(pin),
    attempts:   0,
    lockedUntil: null,
    createdAt:  new Date().toISOString()
  };
  saveUsers(users);
  saveSession({ phone: newUserData.phone, name: newUserData.name, loginAt: new Date().toISOString() });
  showSuccessScreen(`Account created! Welcome, ${newUserData.name}! 🎉`);
}

// ─── LOCK SCREEN ─────────────────────────────────────────────────────────────
function startLockScreen(seconds) {
  showScreen("screenLocked");
  document.querySelectorAll(".auth-screen").forEach(s => s.classList.add("hidden"));
  document.getElementById("screenLocked").classList.remove("hidden");

  let remaining = seconds;
  const timerEl  = document.getElementById("lockTimer");
  const unlockBtn = document.getElementById("unlockBtn");
  timerEl.textContent = remaining;

  const interval = setInterval(() => {
    remaining--;
    timerEl.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(interval);
      unlockBtn.disabled = false;
      unlockBtn.textContent = "Try Again";
    }
  }, 1000);
}

function unlockAccount() {
  // Reset attempts
  const users = getUsers();
  if (users[loginPhone]) {
    users[loginPhone].attempts = 0;
    users[loginPhone].lockedUntil = null;
    saveUsers(users);
  }
  resetPIN("login");
  showScreen("screenPIN");
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
function showSuccessScreen(msg) {
  document.querySelectorAll(".auth-screen").forEach(s => s.classList.add("hidden"));
  const screen = document.getElementById("screenSuccess");
  screen.classList.remove("hidden");
  document.getElementById("successMsg").textContent = msg;

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2200);
}
