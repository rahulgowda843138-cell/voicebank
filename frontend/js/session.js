// session.js — Session guard for dashboard page

const SESSION_KEY = "vb_session";

function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

// If no session, redirect to login
const session = getSession();
if (!session) {
  window.location.href = "login.html";
}

// Show user name in header
if (session) {
  const el = document.getElementById("headerUserName");
  if (el) el.textContent = "👤 " + session.name;
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  }
}
