const mongoose = require("mongoose");

const AssetTokenizationSchema = new mongoose.Schema({
  tokenizationId:       { type: String, unique: true, required: true },
  ownerAccountId:       { type: String, required: true },
  assetType:            { type: String, enum: ["land","real_estate","reit","infra_bond","sme_equity"], required: true },
  valuationUsd:         { type: Number, required: true },
  documentCid:          { type: String },
  legalVerificationHash:{ type: String },
  fractionalTokensMinted:{ type: Number, default: 0 },
  listingId:            { type: String },
  status:               { type: String, enum: ["PENDING_LEGAL","APPROVED","TOKENIZED","LISTED","SOLD"], default: "PENDING_LEGAL" },
  hcsMessageId:         { type: String }
}, { timestamps: true });

const StakingRecordSchema = new mongoose.Schema({
  accountId:      { type: String, required: true },
  tokenId:        { type: String, required: true },
  amount:         { type: Number, required: true },
  poolType:       { type: String },
  apyAtStake:     { type: Number },
  lockPeriodDays: { type: Number, min: 21 },
  stakedAt:       { type: Date, default: Date.now },
  unlockAt:       { type: Date },
  rewardsClaimed: { type: Number, default: 0 },
  status:         { type: String, enum: ["ACTIVE","UNLOCKED","CLAIMED"], default: "ACTIVE" }
});

module.exports = {
  AssetTokenization: mongoose.model("AssetTokenization", AssetTokenizationSchema),
  StakingRecord: mongoose.model("StakingRecord", StakingRecordSchema)
};
