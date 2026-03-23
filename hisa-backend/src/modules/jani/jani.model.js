const mongoose = require("mongoose");

/**
 * Mongoose Schema for JANI Tree Records
 */
const TreeRecordSchema = new mongoose.Schema({
  treeId: { type: String, unique: true, required: true },
  nurseryId: { type: String, required: true },
  species: { type: String, required: true },
  gps: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  planterAccountId: { type: String, required: true },
  assignedValidators: [{ type: String }],
  status: { 
    type: String, 
    enum: ["PENDING", "VERIFIED_PLANTED", "GROWING", "TOKEN_MINTED", "DISPUTED", "DEAD"],
    default: "PENDING"
  },
  verifications: [{
    validatorAccountId: String,
    photoHash: String,
    gpsConfirmed: { lat: Number, lng: Number },
    timestamp: { type: Date, default: Date.now },
    signature: String
  }],
  growthReports: [{
    validatorAccountId: String,
    heightCm: Number,
    healthScore: Number,
    photoHash: String,
    survivalStatus: String,
    aiConfidence: Number,
    reportedAt: { type: Date, default: Date.now }
  }],
  janiTokenMintedAt: Date,
  hcsMessageId: String,
  vcId: String,                    // Guardian VC ID for conservation credential
  vcDocument: Object,              // Full JSON-LD VC (cached locally)
  vcIssuedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("TreeRecord", TreeRecordSchema);
