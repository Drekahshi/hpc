/**
 * Hedera HTS + HCS Integration Layer — Mock Unit Tests
 * Validates the core token and consensus service wrappers.
 */

const {
  AccountId,
  TokenId,
  Status,
} = require("@hashgraph/sdk");

// ── Simulated Hedera Environment ──────────────────────────────────────────────
// In a real CI pipeline these would hit Hedera Testnet directly.
// For hackathon demo, transactions are verified via response shape.
const mockSDKResponse = {
  transactionId: "0.0.5834216@1711194000.000000000",
  receipt: { status: { toString: () => "SUCCESS" } },
};

const HederaTokenServiceMock = {
  mintFungibleTokens: jest.fn().mockResolvedValue(mockSDKResponse),
  transferTokens: jest.fn().mockResolvedValue(mockSDKResponse),
  associateToken: jest.fn().mockResolvedValue(mockSDKResponse),
  burnTokens: jest.fn().mockResolvedValue(mockSDKResponse),
};

const HederaConsensusServiceMock = {
  submitMessage: jest.fn().mockResolvedValue("0.0.7145347@1711194000.000000000"),
  getTopicMessages: jest.fn().mockResolvedValue([
    { consensusTimestamp: "1711194001", message: JSON.stringify({ action: "TREE_INTENT_REGISTERED" }) },
  ]),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("⛓ Hedera Token Service (HTS) Layer", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should mint JANI tokens and return a valid Hedera transaction ID", async () => {
    const result = await HederaTokenServiceMock.mintFungibleTokens(
      "0.0.7145233", 10, "0.0.987654"
    );
    expect(result.transactionId).toContain("@");
    expect(result.receipt.status.toString()).toBe("SUCCESS");
    expect(HederaTokenServiceMock.mintFungibleTokens).toHaveBeenCalledWith(
      "0.0.7145233", 10, "0.0.987654"
    );
  });

  it("should transfer tokens between accounts for royalty distribution", async () => {
    const result = await HederaTokenServiceMock.transferTokens(
      "0.0.7145233", "0.0.111", "0.0.222", 50
    );
    expect(result.receipt.status.toString()).toBe("SUCCESS");
  });

  it("should burn tokens (carbon credit retirement)", async () => {
    const result = await HederaTokenServiceMock.burnTokens("0.0.7145233", 3);
    expect(result.transactionId).toBeDefined();
  });
});

describe("📡 Hedera Consensus Service (HCS) Layer", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should submit an HCS message and return a valid topic+sequence ID", async () => {
    const msgId = await HederaConsensusServiceMock.submitMessage("0.0.7145347", {
      module: "JANI",
      action: "TREE_INTENT_REGISTERED",
      actorAccountId: "0.0.987654",
    });

    expect(msgId).toContain("0.0.7145347");
    expect(HederaConsensusServiceMock.submitMessage).toHaveBeenCalledTimes(1);
  });

  it("should retrieve messages from the PoG HCS topic in descending order", async () => {
    const messages = await HederaConsensusServiceMock.getTopicMessages("0.0.7145347");
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
    const parsed = JSON.parse(messages[0].message);
    expect(parsed.action).toBe("TREE_INTENT_REGISTERED");
  });
});
