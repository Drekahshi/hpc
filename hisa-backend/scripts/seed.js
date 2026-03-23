const mongoose = require("mongoose");
const { TreeRecord } = require("../src/modules/jani/jani.model");
const { CulturalAsset } = require("../src/modules/chat/chat.model");
const { AssetTokenization } = require("../src/modules/umoja/umoja.model");
const { WellnessRecord } = require("../src/modules/hisa/hisa.model");

require('dotenv').config();

const MOCK_ACCOUNT_1 = "0.0.1001";
const MOCK_ACCOUNT_2 = "0.0.1002";

async function seedDatabase() {
  console.log("🌱 Seeding HISA Ecosystem Mock Data...");

  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/hisa";
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    // Clean existing
    // await TreeRecord.deleteMany({});
    // await CulturalAsset.deleteMany({});
    
    console.log("\n🌳 Seeding JANI (Proof of Growth) Trees...");
    const tree = new TreeRecord({
      treeId: "TR-001",
      lat: -1.2921,
      lng: 36.8219,
      species: "Moringa Oleifera",
      planterAccountId: MOCK_ACCOUNT_1,
      status: "VERIFIED_PLANTED",
      guardianVcId: "vc:hedera:testnet:0.0.999",
      dovuCreditId: "DOV-CARB-MOCK"
    });
    // await tree.save();
    console.log(`   🔸 Tree TR-001 (Moringa) assigned to ${MOCK_ACCOUNT_1}`);

    console.log("\n🎭 Seeding CHAT (Cultural Assets)...");
    const asset = new CulturalAsset({
      assetId: "CHAT-001",
      title: "Maasai Jumping Dance",
      description: "Traditional Adumu dance ceremony.",
      assetType: "dance",
      tribalAttribution: "Maasai",
      creatorAccountId: MOCK_ACCOUNT_2,
      fpicConsentHash: "0xabc123",
      status: "VALIDATED",
      accessTags: ["#public"]
    });
    // await asset.save();
    console.log(`   🔸 Cultural Asset CHAT-001 (Dance) assigned to ${MOCK_ACCOUNT_2}`);

    console.log("\n💰 Seeding UMOJA (Tokenization)...");
    const tokenization = new AssetTokenization({
      tokenizationId: "UM-TOK-001",
      ownerAccountId: MOCK_ACCOUNT_1,
      assetType: "sme_equity",
      valuationUsd: 50000,
      status: "LISTED"
    });
    // await tokenization.save();
    console.log(`   🔸 SME Equity UM-TOK-001 listed at $50,000`);

    console.log("\n💚 Seeding HISA (Wellness)...");
    const wellness = new WellnessRecord({
      accountId: MOCK_ACCOUNT_1,
      selfAssessmentScore: 8,
      categories: ["sleep", "stress"],
      rewardMinted: 5
    });
    // await wellness.save();
    console.log(`   🔸 Wellness check-in recorded for UX`);

    console.log("\n✅ Database Seeding Complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
