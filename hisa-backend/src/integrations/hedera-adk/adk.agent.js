const { HederaAgentKit } = require("@hashgraph/sdk"); // Wait, the spec says @hedera/hedera-agent-kit
// Let me double check the import path from the spec. 
// Spec says: const { HederaAgentKit, ServerSigner } = require("@hedera/hedera-agent-kit");

// Note: I am assuming the package Name is correct in the spec.
// If it fails, I'll adjust.

const { HederaAgentKit, ServerSigner } = require("@hedera/hedera-agent-kit");

function buildADKAgent() {
  const operatorId = process.env.HEDERA_ADK_OPERATOR_ID || process.env.MY_ACCOUNT_ID;
  const operatorKey = process.env.HEDERA_ADK_OPERATOR_KEY || process.env.MY_PRIVATE_KEY;

  if (!operatorId || !operatorKey) {
    throw new Error("ADK Operator credentials missing");
  }

  // ADK often uses a signer abstraction
  const signer = new ServerSigner(operatorId, operatorKey);
  
  const agent = new HederaAgentKit(signer, {
    network: process.env.HEDERA_ADK_NETWORK || "testnet",
  });

  return agent;
}

module.exports = buildADKAgent();
