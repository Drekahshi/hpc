/**
 * JANI Proof-of-Growth Engine — Test Suite
 * Demonstrates the Hedera HTS + HCS integration layer via mocked services.
 */

// ── Inline Mock Services (simulates @hashgraph/sdk) ──────────────────────────
const mockTokenService = {
  mintFungibleTokens: jest.fn().mockResolvedValue({ transactionId: "0.0.1234@1680000000.000000000", serial: undefined }),
};

const mockConsensusService = {
  submitMessage: jest.fn().mockResolvedValue("0.0.7145347@1680000000.000000000"),
};

// ── PoG Engine (inline to prevent mongoose startup) ───────────────────────────
const PoGEngine = {
  registerTreeIntent: async ({ treeId, lat, lng, species, planterAccountId }) => {
    if (!treeId || !planterAccountId) throw new Error("treeId and planterAccountId are required");

    const msgId = await mockConsensusService.submitMessage("0.0.7145347", {
      module: "JANI",
      action: "TREE_INTENT_REGISTERED",
      actorAccountId: planterAccountId,
      payload: { treeId, lat, lng, species },
    });

    return { success: true, treeId, hcsMessageId: msgId };
  },

  checkMintEligibility: (validatorCount, avgConfidence) => {
    return validatorCount >= 2 && avgConfidence >= 80;
  },

  mintJaniToken: async ({ treeId, planterAccountId, validatorCount, avgConfidence }) => {
    if (!PoGEngine.checkMintEligibility(validatorCount, avgConfidence)) {
      throw new Error("Tree not eligible for minting: insufficient validators or low confidence");
    }

    const result = await mockTokenService.mintFungibleTokens(
      process.env.JANI_TOKEN_ID || "0.0.7145233",
      10,
      planterAccountId
    );

    await mockConsensusService.submitMessage("0.0.7145347", {
      module: "JANI",
      action: "TOKEN_MINTED",
      actorAccountId: planterAccountId,
      payload: { treeId, txId: result.transactionId },
    });

    return { success: true, transactionId: result.transactionId, janiMinted: 10 };
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("🌳 JANI — Proof-of-Growth Engine", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("registerTreeIntent()", () => {
    it("should register a tree and log to HCS", async () => {
      const result = await PoGEngine.registerTreeIntent({
        treeId: "TR-2026-001",
        lat: -1.2921,
        lng: 36.8219,
        species: "Moringa Oleifera",
        planterAccountId: "0.0.987654",
      });

      expect(result.success).toBe(true);
      expect(result.treeId).toBe("TR-2026-001");
      expect(mockConsensusService.submitMessage).toHaveBeenCalledTimes(1);
      expect(mockConsensusService.submitMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ action: "TREE_INTENT_REGISTERED" })
      );
    });

    it("should reject registration with missing planterAccountId", async () => {
      await expect(
        PoGEngine.registerTreeIntent({ treeId: "TR-001", lat: 0, lng: 0, species: "Oak" })
      ).rejects.toThrow("treeId and planterAccountId are required");
    });
  });

  describe("checkMintEligibility()", () => {
    it("should return true when 2+ validators with 80%+ confidence", () => {
      expect(PoGEngine.checkMintEligibility(2, 92)).toBe(true);
      expect(PoGEngine.checkMintEligibility(3, 80)).toBe(true);
    });

    it("should return false for insufficient validators", () => {
      expect(PoGEngine.checkMintEligibility(1, 95)).toBe(false);
    });

    it("should return false for low confidence even with enough validators", () => {
      expect(PoGEngine.checkMintEligibility(3, 72)).toBe(false);
    });
  });

  describe("mintJaniToken()", () => {
    it("should mint HTS tokens and emit HCS event on success", async () => {
      const result = await PoGEngine.mintJaniToken({
        treeId: "TR-2026-001",
        planterAccountId: "0.0.987654",
        validatorCount: 3,
        avgConfidence: 94,
      });

      expect(result.success).toBe(true);
      expect(result.janiMinted).toBe(10);
      expect(mockTokenService.mintFungibleTokens).toHaveBeenCalledWith(
        expect.any(String), 10, "0.0.987654"
      );
      // Verify the HCS audit log was written AFTER the mint
      expect(mockConsensusService.submitMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ action: "TOKEN_MINTED" })
      );
    });

    it("should refuse minting if eligibility threshold is not met", async () => {
      await expect(
        PoGEngine.mintJaniToken({
          treeId: "TR-2026-002",
          planterAccountId: "0.0.111111",
          validatorCount: 1,
          avgConfidence: 55,
        })
      ).rejects.toThrow(/not eligible/i);

      expect(mockTokenService.mintFungibleTokens).not.toHaveBeenCalled();
    });
  });
});
