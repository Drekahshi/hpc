const bcrypt = require("bcryptjs");
const User = require("./user.model");
const { generateToken } = require("./auth.middleware");
const logger = require("../utils/logger");

/**
 * Register a new HISA user (phone-hash based, no PII stored)
 */
const register = async (req, res) => {
  try {
    const { hederaAccountId, phoneHash, region } = req.body;

    const existing = await User.findOne({ $or: [{ hederaAccountId }, { phoneHash }] });
    if (existing) {
      return res.status(409).json({ success: false, error: "Account already registered" });
    }

    const user = await User.create({ hederaAccountId, phoneHash, region });

    const token = generateToken({ id: user._id, hederaAccountId, roles: user.roles });

    logger.info(`New user registered: ${hederaAccountId}`);
    res.status(201).json({ success: true, token, accountId: hederaAccountId });
  } catch (err) {
    logger.error(`Register error: ${err.message}`);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
};

/**
 * Login via Hedera account signature (simplified)
 */
const login = async (req, res) => {
  try {
    const { hederaAccountId, signature } = req.body;

    // In production: verify the signature against the account's public key using the Hedera SDK
    const user = await User.findOne({ hederaAccountId });
    if (!user) return res.status(404).json({ success: false, error: "Account not found" });

    const token = generateToken({ id: user._id, hederaAccountId, roles: user.roles });

    logger.info(`User login: ${hederaAccountId}`);
    res.json({ success: true, token, roles: user.roles });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ success: false, error: "Login failed" });
  }
};

/**
 * Get authenticated user's profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { register, login, getProfile };
