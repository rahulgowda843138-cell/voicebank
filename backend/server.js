const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const path    = require("path");

const accountRoutes = require("./routes/accounts");
const txnRoutes     = require("./routes/transactions");
const voiceRoutes   = require("./routes/voice");

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ─────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP (fix buttons issue)
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Serve frontend ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, "../frontend")));

// ─── API Routes ─────────────────────────────────────────────
app.use("/api/accounts",     accountRoutes);
app.use("/api/transactions", txnRoutes);
app.use("/api/voice",        voiceRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ VoiceBank server running on port ${PORT}`);
});