const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  hederaAccountId: { type: String, unique: true, sparse: true },
  phoneHash:       { type: String, unique: true, sparse: true },
  identityHash:    { type: String },
  did:             { type: String },          // did:hedera:testnet:0.0.XXXXX
  kycStatus:       { type: String, enum: ["PENDING", "VERIFIED", "REJECTED"], default: "PENDING" },
  kycVcId:         { type: String },          // Guardian VC credential ID
  roles:           [{ type: String, enum: ["USER", "VALIDATOR", "AMBASSADOR", "ADMIN"], default: "USER" }],
  region:          { type: String },
  reputationScore: { type: Number, default: 100 },
  createdAt:       { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
