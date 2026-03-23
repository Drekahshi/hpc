// Import required modules
import {
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenMintTransaction,
  TokenSupplyType,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Grab the OPERATOR_ID and OPERATOR_KEY from the .env file
const operatorId = process.env.OPERATOR_ID;
const operatorKey = process.env.OPERATOR_KEY;

async function treePlantingAndJaniIssuance() {
  // Build Hedera testnet client
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  try {
    // Step 1: Create the JANI HTS Token (Fungible, with initial supply 0, max supply unlimited for mock)
    const supplyKey = PrivateKey.generateECDSA();
    const adminKey = supplyKey; // Using same key for simplicity in mock

    const tokenCreateTx = new TokenCreateTransaction()
      .setTokenName("JANI Token")
      .setTokenSymbol("JANI")
      .setDecimals(0) // Whole tokens, since 1 tree = 1 JANI
      .setInitialSupply(0)
      .setSupplyType(TokenSupplyType.Infinite) // For ongoing minting
      .setTreasuryAccountId(operatorId)
      .setAdminKey(adminKey.publicKey)
      .setSupplyKey(supplyKey.publicKey)
      .setTokenMemo("JANI Token for Conservation - Mock Test")
      .freezeWith(client);

    const signedTokenCreateTx = await tokenCreateTx.sign(adminKey);
    const tokenCreateResponse = await signedTokenCreateTx.execute(client);
    const tokenCreateReceipt = await tokenCreateResponse.getReceipt(client);
    const tokenId = tokenCreateReceipt.tokenId;

    console.log(`JANI Token created with ID: ${tokenId}`);

    // Step 2: Create HCS Topic for logging tree planting events
    const topicCreateTx = await new TopicCreateTransaction().execute(client);
    const topicReceipt = await topicCreateTx.getReceipt(client);
    const topicId = topicReceipt.topicId;

    console.log(`HCS Topic created with ID: ${topicId}`);

    // Wait 5 seconds for topic to propagate
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Step 3: Submit mock tree planting message to HCS
    const plantingMessage = JSON.stringify({
      event: "Tree Planting",
      treeId: "T1234",
      species: "Bamboo",
      gps: [1.2921, 36.8219],
      plantedBy: "Validator1",
      timestamp: new Date().toISOString(),
      status: "Planted",
    });

    const messageTx = new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: plantingMessage,
    });

    const messageResponse = await messageTx.execute(client);
    const messageReceipt = await messageResponse.getReceipt(client);

    console.log(`Tree planting message submitted to HCS: Status - ${messageReceipt.status}`);

    // Step 4: Mint 1 JANI token upon successful verification (mocked here)
    const mintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(1) // 1 JANI per tree
      .freezeWith(client);

    const signedMintTx = await mintTx.sign(supplyKey);
    const mintResponse = await signedMintTx.execute(client);
    const mintReceipt = await mintResponse.getReceipt(client);

    console.log(`Minted 1 JANI token: Status - ${mintReceipt.status}`);

    // Optional: Query token balance (mock treasury check)
    console.log("\nWaiting for Mirror Node to update...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${operatorId}/tokens?token.id=${tokenId}`;
    const response = await fetch(mirrorNodeUrl);
    const data = await response.json();

    if (data.tokens && data.tokens.length > 0) {
      const balance = data.tokens[0].balance;
      console.log(`Treasury JANI balance: ${balance}`);
    } else {
      console.log("Token balance not yet available in Mirror Node");
    }

  } catch (error) {
    console.error("Error in tree planting and JANI issuance:", error);
  } finally {
    client.close();
  }
}

treePlantingAndJaniIssuance();
