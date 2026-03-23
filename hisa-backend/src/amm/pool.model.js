const mongoose = require("mongoose");

/**
 * UCSE Liquidity Pool — tracks staked tokens and manages yield calculation
 */
const LiquidityPoolSchema = new mongoose.Schema({
  poolId:         { type: String, unique: true, required: true },
  tokenA:         { type: String, required: true },      // e.g. "JANI"
  tokenB:         { type: String, required: true },      // e.g. "UMOS"
  reserveA:       { type: Number, default: 0 },
  reserveB:       { type: Number, default: 0 },
  totalLPTokens:  { type: Number, default: 0 },
  feeRate:        { type: Number, default: 0.003 },      // 0.3%
  volume24h:      { type: Number, default: 0 },
  tvlUsd:         { type: Number, default: 0 },
  createdAt:      { type: Date, default: Date.now },
});

module.exports = mongoose.model("LiquidityPool", LiquidityPoolSchema);
