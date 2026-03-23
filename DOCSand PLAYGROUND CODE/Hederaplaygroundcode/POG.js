const {
  AccountId,
  PrivateKey,
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  Hbar,
} = require("@hashgraph/sdk"); // v2.64.5

// ==================== CONFIGURATION ====================
const MY_ACCOUNT_ID = AccountId.fromString("0.0.5834216");
const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA(
  "0xbd68588b9994d1ba6d274b2e502442ab41454faf2adaca072d32928a1f4dea5d"
);

// ==================== JANI PoG DATA STRUCTURES ====================
class TreeData {
  constructor(treeId, species, lat, lon, validator) {
    this.treeId = treeId;
    this.species = species;
    this.gps = { latitude: lat, longitude: lon };
    this.validator = validator;
    this.timestamp = new Date().toISOString();
    this.status = "pending"; // pending, verified, disputed
    this.survivalScore = 0; // 0-100
  }
}

class ValidatorData {
  constructor(name, stakedTokens) {
    this.validatorName = name;
    this.stakedTokens = stakedTokens;
    this.reputationScore = 50; // Initial score
    this.verified_trees = 0;
    this.accuracy_rate = 100;
  }
}

// ==================== MAIN FUNCTION ====================
async function main() {
  let client;

  try {
    // ==================== SETUP CLIENT ====================
    console.log("\n========== JANI PoG CONSENSUS SYSTEM ==========\n");
    console.log("🔧 Initializing Hedera Testnet Client...");

    client = Client.forTestnet();
    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

    // ==================== STEP 1: CREATE JANI TOKEN ====================
    console.log("\n📝 Step 1: Creating JANI Token (HTS)...");

    const janiTokenTx = new TokenCreateTransaction()
      .setTokenName("JANI Token")
      .setTokenSymbol("JANI")
      .setTokenType(TokenType.FungibleCommon)
      .setDecimals(2)
      .setInitialSupply(50000000) // 50 million tokens
      .setSupplyType(TokenSupplyType.Infinite)
      .setTreasuryAccountId(MY_ACCOUNT_ID)
      .setAdminKey(MY_PRIVATE_KEY)
      .setSupplyKey(MY_PRIVATE_KEY)
      .freezeWith(client);

    const janiTokenSign = await janiTokenTx.sign(MY_PRIVATE_KEY);
    const janiTokenSubmit = await janiTokenSign.execute(client);
    const janiTokenReceipt = await janiTokenSubmit.getReceipt(client);

    const janiTokenId = janiTokenReceipt.tokenId.toString();
    console.log("✅ JANI Token Created!");
    console.log("   Token ID:", janiTokenId);
    console.log(
      "   Hashscan:",
      "https://hashscan.io/testnet/token/" + janiTokenId
    );

    // ==================== STEP 2: CREATE VERIFICATION TOPIC ====================
    console.log("\n📝 Step 2: Creating Consensus Topic for Tree Verification...");

    const txCreateTopic = new TopicCreateTransaction()
      .setTopicMemo("JANI Proof of Growth - Tree Verification Stream")
      .freezeWith(client);

    const txCreateTopicSign = await txCreateTopic.sign(MY_PRIVATE_KEY);
    const txCreateTopicResponse = await txCreateTopicSign.execute(client);
    const receiptCreateTopicTx = await txCreateTopicResponse.getReceipt(client);

    const topicId = receiptCreateTopicTx.topicId.toString();
    const txCreateTopicId = txCreateTopicResponse.transactionId.toString();

    console.log("✅ Verification Topic Created!");
    console.log("   Topic ID:", topicId);
    console.log(
      "   Hashscan:",
      "https://hashscan.io/testnet/transaction/" + txCreateTopicId
    );

    // ==================== STEP 3: SUBMIT VALIDATOR REGISTRATIONS ====================
    console.log("\n📝 Step 3: Registering Validators...");

    const validators = [
      new ValidatorData("Validator_Alice", 100),
      new ValidatorData("Validator_Bob", 150),
      new ValidatorData("Validator_Carol", 200),
    ];

    const validatorMessages = [];

    for (const validator of validators) {
      const validatorMsg = {
        messageType: "validator_registration",
        validator: validator.validatorName,
        stakedTokens: validator.stakedTokens,
        reputationScore: validator.reputationScore,
        timestamp: new Date().toISOString(),
      };

      const txSubmitValidator = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(validatorMsg))
        .freezeWith(client);

      const txSubmitValidatorSign = await txSubmitValidator.sign(MY_PRIVATE_KEY);
      const txSubmitValidatorResponse = await txSubmitValidatorSign.execute(
        client
      );
      const txSubmitValidatorReceipt = await txSubmitValidatorResponse.getReceipt(
        client
      );

      console.log(`   ✅ ${validator.validatorName} registered`);
      console.log(
        `      Staked: ${validator.stakedTokens} JANI | Reputation: ${validator.reputationScore}`
      );

      validatorMessages.push({
        validator: validator.validatorName,
        sequenceNumber: txSubmitValidatorReceipt.topicSequenceNumber,
      });
    }

    // ==================== STEP 4: SUBMIT TREE PLANTING EVENTS ====================
    console.log("\n📝 Step 4: Registering Tree Planting Events...");

    const trees = [
      new TreeData("TREE_001", "Acacia", -1.2855, 36.8172, "Validator_Alice"),
      new TreeData("TREE_002", "Bamboo", -1.2900, 36.8150, "Validator_Bob"),
      new TreeData("TREE_003", "Mango", -1.2870, 36.8190, "Validator_Carol"),
      new TreeData("TREE_004", "Cedar", -1.2840, 36.8200, "Validator_Alice"),
    ];

    const treeMessages = [];

    for (const tree of trees) {
      const treeMsg = {
        messageType: "tree_planted",
        treeId: tree.treeId,
        species: tree.species,
        gps: tree.gps,
        validator: tree.validator,
        timestamp: tree.timestamp,
        status: tree.status,
      };

      const txSubmitTree = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(treeMsg))
        .freezeWith(client);

      const txSubmitTreeSign = await txSubmitTree.sign(MY_PRIVATE_KEY);
      const txSubmitTreeResponse = await txSubmitTreeSign.execute(client);
      const txSubmitTreeReceipt = await txSubmitTreeResponse.getReceipt(client);

      console.log(`   ✅ ${tree.treeId} planted`);
      console.log(
        `      Species: ${tree.species} | Location: [${tree.gps.latitude}, ${tree.gps.longitude}]`
      );
      console.log(`      Validator: ${tree.validator}`);

      treeMessages.push({
        treeId: tree.treeId,
        sequenceNumber: txSubmitTreeReceipt.topicSequenceNumber,
      });
    }

    // ==================== STEP 5: SUBMIT TREE VERIFICATION (PoG) ====================
    console.log("\n📝 Step 5: Submitting Tree Verification (Proof of Growth)...");

    const verifications = [
      {
        treeId: "TREE_001",
        validator: "Validator_Alice",
        survivalScore: 95,
        healthStatus: "Excellent",
      },
      {
        treeId: "TREE_002",
        validator: "Validator_Bob",
        survivalScore: 88,
        healthStatus: "Good",
      },
      {
        treeId: "TREE_003",
        validator: "Validator_Carol",
        survivalScore: 75,
        healthStatus: "Fair",
      },
      {
        treeId: "TREE_004",
        validator: "Validator_Alice",
        survivalScore: 92,
        healthStatus: "Excellent",
      },
    ];

    const verificationMessages = [];
    let totalTokensToMint = 0;

    for (const verification of verifications) {
      // Calculate token reward based on survival score
      const baseReward = 1; // 1 JANI token per verified tree
      const bonus = verification.survivalScore > 80 ? 1 : 0; // Bonus for >80% health
      const totalReward = baseReward + bonus;
      totalTokensToMint += totalReward;

      const verificationMsg = {
        messageType: "tree_verified",
        treeId: verification.treeId,
        validator: verification.validator,
        survivalScore: verification.survivalScore,
        healthStatus: verification.healthStatus,
        tokensMinted: totalReward,
        timestamp: new Date().toISOString(),
        consensusStatus: "confirmed",
      };

      const txSubmitVerification = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(verificationMsg))
        .freezeWith(client);

      const txSubmitVerificationSign = await txSubmitVerification.sign(
        MY_PRIVATE_KEY
      );
      const txSubmitVerificationResponse = await txSubmitVerificationSign.execute(
        client
      );
      const txSubmitVerificationReceipt = await txSubmitVerificationResponse.getReceipt(
        client
      );

      console.log(`   ✅ ${verification.treeId} verified`);
      console.log(
        `      Score: ${verification.survivalScore}% | Status: ${verification.healthStatus}`
      );
      console.log(
        `      Tokens Minted: ${totalReward} JANI | Validator: ${verification.validator}`
      );

      verificationMessages.push({
        treeId: verification.treeId,
        tokensReward: totalReward,
        sequenceNumber: txSubmitVerificationReceipt.topicSequenceNumber,
      });
    }

    // ==================== STEP 6: PRINT SUMMARY ====================
    console.log("\n========== JANI PoG CONSENSUS - SUMMARY ==========\n");

    console.log("📊 TOKENS CREATED:");
    console.log(`   Total JANI Tokens: 50,000,000`);
    console.log(`   Initial Supply: 50,000,000`);
    console.log(`   Decimals: 2`);
    console.log(`   Token ID: ${janiTokenId}`);

    console.log("\n📡 CONSENSUS INFRASTRUCTURE:");
    console.log(`   Topic ID (Verification Stream): ${topicId}`);
    console.log(`   Validators Registered: ${validators.length}`);
    console.log(`   Trees Planted: ${trees.length}`);
    console.log(`   Trees Verified: ${verifications.length}`);
    console.log(`   Total JANI Tokens Minted: ${totalTokensToMint}`);

    console.log("\n✅ VALIDATORS REGISTERED:");
    validators.forEach((v, idx) => {
      console.log(
        `   ${idx + 1}. ${v.validatorName} | Stake: ${v.stakedTokens} JANI`
      );
    });

    console.log("\n🌱 TREES VERIFIED (PoG):");
    verifications.forEach((v, idx) => {
      console.log(
        `   ${idx + 1}. ${v.treeId} | Score: ${v.survivalScore}% | Reward: ${v.survivalScore > 80 ? 2 : 1} JANI`
      );
    });

    console.log("\n🔗 HEDERA EXPLORER LINKS:");
    console.log(`   Token: https://hashscan.io/testnet/token/${janiTokenId}`);
    console.log(`   Topic: https://hashscan.io/testnet/topic/${topicId}`);
    console.log(
      `   Account: https://hashscan.io/testnet/account/${MY_ACCOUNT_ID}`
    );

    console.log("\n✨ JANI PoG Consensus System Initialized Successfully! ✨\n");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    if (client) {
      client.close();
    }
  }
}

main();
