const express = require("express");
const router = express.Router();
const { runKAIQuery, explainTransaction } = require("./kai.agent");
const { authenticate } = require("../auth/auth.middleware");

/**
 * POST /api/v1/ai/chat
 * Natural language interface to the KAI Ecosystem Agent
 */
router.post("/chat", authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(422).json({ success: false, error: "message is required" });

    const result = await runKAIQuery(message, { user: req.user });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/v1/ai/explain-tx
 * Explain a Hedera transaction in plain language
 */
router.post("/explain-tx", authenticate, async (req, res) => {
  try {
    const result = await explainTransaction(req.body.txRecord);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
