const express = require("express");
const router = express.Router();
const wellnessEngine = require("./wellness.engine");

// Wellness check-in
router.post("/wellness/checkin", async (req, res) => {
  try {
    const result = await wellnessEngine.submitWellnessCheckIn(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Record SDG action
router.post("/sdg/action", async (req, res) => {
  try {
    const result = await wellnessEngine.recordSDGAction(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// SDG dashboard
router.get("/sdg/dashboard", async (req, res) => {
  try {
    const result = await wellnessEngine.getSDGDashboard(req.query.accountId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
