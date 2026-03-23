const express = require("express");
const router = express.Router();
const chatService = require("./chat.service");
const validatorCouncil = require("./validator.council");

// Upload cultural asset
router.post("/asset/upload", async (req, res) => {
  try {
    const result = await chatService.uploadCulturalAsset(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Mint cultural NFT
router.post("/asset/:assetId/mint", async (req, res) => {
  try {
    const result = await chatService.mintCulturalNFT(req.params.assetId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Validator submits decision
router.post("/validate/:assetId", async (req, res) => {
  try {
    const { validatorAccountId, decision, reason, accessTag } = req.body;
    const result = await validatorCouncil.submitValidatorDecision(
      req.params.assetId, validatorAccountId, decision, reason, accessTag
    );
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
