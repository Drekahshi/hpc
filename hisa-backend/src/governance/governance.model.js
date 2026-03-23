const mongoose = require("mongoose");

/**
 * On-chain Governance Proposal (mirrors HCS governance topic)
 */
const ProposalSchema = new mongoose.Schema({
  proposalId:       { type: String, unique: true, required: true },
  title:            { type: String, required: true },
  description:      { type: String, required: true },
  proposerAccountId:{ type: String, required: true },
  category:         { type: String, enum: ["PROTOCOL_UPGRADE","TREASURY","POLICY","VALIDATOR","ECOSYSTEM"], required: true },
  status:           { type: String, enum: ["ACTIVE","PASSED","REJECTED","EXECUTED","CANCELLED"], default: "ACTIVE" },
  startBlock:       { type: Number },
  endBlock:         { type: Number },
  votesFor:         { type: Number, default: 0 },
  votesAgainst:     { type: Number, default: 0 },
  quorumRequired:   { type: Number, default: 0.33 },
  hcsMessageId:     { type: String },
  executionTxId:    { type: String },
}, { timestamps: true });

const VoteSchema = new mongoose.Schema({
  proposalId:   { type: String, required: true, ref: "Proposal" },
  accountId:    { type: String, required: true },
  vote:         { type: String, enum: ["FOR", "AGAINST", "ABSTAIN"], required: true },
  votingPower:  { type: Number, default: 1 },
  castAt:       { type: Date, default: Date.now },
});

// One wallet = one vote per proposal
VoteSchema.index({ proposalId: 1, accountId: 1 }, { unique: true });

module.exports = {
  Proposal: mongoose.model("Proposal", ProposalSchema),
  Vote: mongoose.model("Vote", VoteSchema),
};
