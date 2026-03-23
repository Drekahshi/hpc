const express = require("express");
const router = express.Router();
const ammEngine = require("./amm.engine");
const { authenticate } = require("../auth/auth.middleware");

router.get("/pool/:poolId/price", authenticate, async (req, res) => {
  try {
    const result = await ammEngine.getPrice(req.params.poolId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post("/pool/:poolId/swap", authenticate, async (req, res) => {
  try {
    const { accountId, tokenIn, amountIn } = req.body;
    const result = await ammEngine.swap(req.params.poolId, accountId, tokenIn, amountIn);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post("/pool/:poolId/liquidity", authenticate, async (req, res) => {
  try {
    const { accountId, amountA, amountB } = req.body;
    const result = await ammEngine.addLiquidity(req.params.poolId, accountId, amountA, amountB);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
