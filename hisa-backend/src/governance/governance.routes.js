const express = require("express");
const router = express.Router();
const govService = require("./governance.service");
const { authenticate, authorize } = require("../auth/auth.middleware");
const { Proposal } = require("./governance.model");

// Create proposal (anyone can propose)
router.post("/proposals", authenticate, async (req, res) => {
  try {
    const result = await govService.createProposal(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// List all proposals
router.get("/proposals", async (req, res) => {
  try {
    const { status } = req.query;
    const proposals = await Proposal.find(status ? { status } : {}).sort({ createdAt: -1 });
    res.json({ success: true, data: proposals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cast a vote
router.post("/proposals/:proposalId/vote", authenticate, async (req, res) => {
  try {
    const { accountId, vote, votingPower } = req.body;
    const result = await govService.castVote(req.params.proposalId, accountId, vote, votingPower);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Finalize proposal (admin only)
router.post("/proposals/:proposalId/finalize", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const result = await govService.finalizeProposal(req.params.proposalId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
