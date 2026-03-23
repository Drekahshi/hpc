const express = require("express");
const router = express.Router();
const pogEngine = require("./pog.engine");

router.post("/tree/intent", async (req, res) => {
  try {
    const result = await pogEngine.registerPlantingIntent(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/tree/verify", async (req, res) => {
  try {
    const { treeId, verificationData } = req.body;
    const result = await pogEngine.submitPlantingVerification(treeId, verificationData);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/tree/mint", async (req, res) => {
  try {
    const { treeId } = req.body;
    const result = await pogEngine.mintJaniToken(treeId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
