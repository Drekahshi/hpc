const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

/**
 * Middleware: verify JWT token on protected routes
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn(`JWT Auth failed: ${err.message}`);
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

/**
 * Middleware: restrict access to specific roles
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: "Not authenticated" });
  const hasRole = allowedRoles.some(role => req.user.roles?.includes(role));
  if (!hasRole) {
    return res.status(403).json({ success: false, error: "Access denied: insufficient role" });
  }
  next();
};

/**
 * Generate a signed JWT for a user
 */
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

module.exports = { authenticate, authorize, generateToken };
