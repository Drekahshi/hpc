const LiquidityPool = require("./pool.model");
const consensusService = require("../hedera/consensus.service");
const logger = require("../utils/logger");

/**
 * UCSE — Universal Community Stock Exchange — AMM Engine
 * Implements the constant-product market maker formula: x * y = k
 */
class AMMEngine {
  /**
   * Get the current price of tokenA in terms of tokenB
   */
  async getPrice(poolId) {
    const pool = await LiquidityPool.findOne({ poolId });
    if (!pool || pool.reserveA === 0) throw new Error("Pool not found or empty");

    return { price: pool.reserveB / pool.reserveA, pool };
  }

  /**
   * Simulate a swap and return the expected output amount
   */
  calcSwapOutput(amountIn, reserveIn, reserveOut, feeRate = 0.003) {
    const amountInWithFee = amountIn * (1 - feeRate);
    return (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
  }

  /**
   * Execute a token swap in the UCSE pool
   */
  async swap(poolId, accountId, tokenIn, amountIn) {
    const pool = await LiquidityPool.findOne({ poolId });
    if (!pool) throw new Error(`Pool ${poolId} not found`);

    const isTokenA = pool.tokenA === tokenIn;
    const [reserveIn, reserveOut] = isTokenA
      ? [pool.reserveA, pool.reserveB]
      : [pool.reserveB, pool.reserveA];

    const amountOut = this.calcSwapOutput(amountIn, reserveIn, reserveOut, pool.feeRate);
    const fee = amountIn * pool.feeRate;

    // Update pool reserves
    if (isTokenA) {
      pool.reserveA += amountIn;
      pool.reserveB -= amountOut;
    } else {
      pool.reserveB += amountIn;
      pool.reserveA -= amountOut;
    }
    pool.volume24h += amountIn;
    await pool.save();

    await consensusService.submitMessage(process.env.GOVERNANCE_TOPIC_ID, {
      module: "AMM",
      action: "SWAP_EXECUTED",
      actorAccountId: accountId,
      payload: { poolId, tokenIn, amountIn, amountOut, fee },
    });

    logger.info(`Swap: ${amountIn} ${tokenIn} → ${amountOut.toFixed(6)} in pool ${poolId}`);
    return { amountIn, amountOut: parseFloat(amountOut.toFixed(6)), fee: parseFloat(fee.toFixed(6)) };
  }

  /**
   * Add liquidity to a pool
   */
  async addLiquidity(poolId, accountId, amountA, amountB) {
    const pool = await LiquidityPool.findOne({ poolId });
    if (!pool) throw new Error(`Pool ${poolId} not found`);

    const lpTokens =
      pool.totalLPTokens === 0
        ? Math.sqrt(amountA * amountB)
        : Math.min(
            (amountA / pool.reserveA) * pool.totalLPTokens,
            (amountB / pool.reserveB) * pool.totalLPTokens
          );

    pool.reserveA += amountA;
    pool.reserveB += amountB;
    pool.totalLPTokens += lpTokens;
    await pool.save();

    return { lpTokens: parseFloat(lpTokens.toFixed(6)), poolId };
  }
}

module.exports = new AMMEngine();
