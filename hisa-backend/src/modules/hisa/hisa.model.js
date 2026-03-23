const mongoose = require("mongoose");

// IMPORTANT: No PII stored — only accountId hashes and scores
const WellnessRecordSchema = new mongoose.Schema({
  accountId:          { type: String, required: true },   // plain accountId (not sensitive)
  selfAssessmentScore:{ type: Number, min: 1, max: 10, required: true },
  categories:         [String],
  encryptedData:      { type: String },   // user-controlled ciphertext only
  rewardMinted:       { type: Number, default: 0 },
  riskFlag:           { type: Boolean, default: false },
  createdAt:          { type: Date, default: Date.now }
});

const SDGImpactRecordSchema = new mongoose.Schema({
  accountId:         { type: String, required: true },
  actionType:        { type: String, required: true },
  moduleSource:      { type: String, enum: ["JANI","CHAT","UMOJA","HISA"], required: true },
  sdgGoal:           { type: Number, min: 1, max: 17 },
  impactMetric:      { type: Object },
  verificationHash:  { type: String },
  tokensDistributed: { type: Object },   // { JANI: x, CHAT: y, HISA: z }
  recordedAt:        { type: Date, default: Date.now },
  hcsMessageId:      { type: String }
});

module.exports = {
  WellnessRecord:  mongoose.model("WellnessRecord", WellnessRecordSchema),
  SDGImpactRecord: mongoose.model("SDGImpactRecord", SDGImpactRecordSchema)
};
