const crypto = require("crypto");

/**
 * Generate a SHA-256 hash of any object
 */
const hashObject = (obj) =>
  crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");

/**
 * Generate a unique HISA compliant ID
 * Format: <MODULE>-<TIMESTAMP>-<RANDOM4>
 */
const generateHISAId = (module) => {
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${module.toUpperCase()}-${Date.now()}-${rand}`;
};

/**
 * Convert HBAR to USD given an exchange rate
 */
const hbarToUSD = (hbar, ratePerHbar) => parseFloat((hbar * ratePerHbar).toFixed(4));

/**
 * Sleep utility for async delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate a Hedera Account ID format
 */
const isValidHederaAccountId = (accountId) => /^0\.0\.\d+$/.test(accountId);

/**
 * Paginate a Mongoose query
 */
const paginate = async (Model, query = {}, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Model.countDocuments(query),
  ]);
  return {
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

module.exports = { hashObject, generateHISAId, hbarToUSD, sleep, isValidHederaAccountId, paginate };
