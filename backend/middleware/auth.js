// middleware/auth.js — Simple token-based auth middleware

const { users } = require("../models/db");

/**
 * For a real system, use JWT.
 * Here we use a simple header check: x-user-id
 */
function authMiddleware(req, res, next) {
  const userId = req.headers["x-user-id"] || req.body?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required. Provide x-user-id header." });
  }

  if (!users[userId]) {
    return res.status(403).json({ error: "Invalid user" });
  }

  req.userId = userId;
  req.user   = users[userId];
  next();
}

module.exports = authMiddleware;
