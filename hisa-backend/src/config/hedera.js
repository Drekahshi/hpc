const { Client, AccountId, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config();

function buildHederaClient() {
  const network = process.env.HEDERA_NETWORK || "testnet";
  const accountIdStr = process.env.MY_ACCOUNT_ID;
  const privateKeyStr = process.env.MY_PRIVATE_KEY;

  if (!accountIdStr || !privateKeyStr) {
    throw new Error("Hedera credentials missing in environment");
  }

  const accountId = AccountId.fromString(accountIdStr);
  
  // Try to parse private key (handles both ED25519 and ECDSA formats if SDK supports string auto-detect)
  const privateKey = PrivateKey.fromString(privateKeyStr);

  const client =
    network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
  client.setOperator(accountId, privateKey);

  return { client, operatorId: accountId, operatorKey: privateKey };
}

module.exports = buildHederaClient();
