const mongoose = require("mongoose");

const CulturalAssetSchema = new mongoose.Schema({
  assetId:          { type: String, unique: true, required: true },
  title:            { type: String, required: true },
  description:      { type: String },
  assetType:        { type: String, enum: ["oral_story","song","dance","craft","ceremony","language","symbol","artifact"], required: true },
  tribalAttribution:{ type: String, required: true },
  geoTag:           { lat: Number, lng: Number, country: String, region: String },
  language:         { type: String },
  cid:              { type: String },           // IPFS CID of actual asset
  metadataCid:      { type: String },           // IPFS CID of metadata JSON
  creatorAccountId: { type: String, required: true },
  fpicConsentHash:  { type: String, required: true },  // FPIC is mandatory
  accessTags:       [String],
  nftSerial:        { type: Number },
  validationDecisions: [{
    validatorAccountId: String,
    decision:  { type: String, enum: ["APPROVE", "REJECT", "FLAG_SENSITIVE"] },
    reason:    String,
    accessTagSuggested: String,
    decidedAt: Date
  }],
  status: {
    type: String,
    enum: ["PENDING_VALIDATION","UNDER_REVIEW","VALIDATED","MINTED","REJECTED"],
    default: "PENDING_VALIDATION"
  },
  vcId:         String,
  vcDocument:   Object,
  royaltyBps:   { type: Number, default: 500 },   // 5%
  hcsMessageId: String
}, { timestamps: true });

module.exports = mongoose.model("CulturalAsset", CulturalAssetSchema);
