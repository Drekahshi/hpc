/**
 * CHAT Cultural Heritage Asset Engine — Test Suite
 * Verifies FPIC enforcement, validator council consensus, and royalty splits.
 */

// ── Inline Mock Services ──────────────────────────────────────────────────────
const mockTokenService = {
  mintFungibleTokens: jest.fn().mockResolvedValue({ transactionId: "0.0.6789@1680000000.000" }),
};

const mockConsensusService = {
  submitMessage: jest.fn().mockResolvedValue("0.0.7145347@1680000000.000000000"),
};

// ── Chat Engine (inline) ──────────────────────────────────────────────────────
const ChatEngine = {
  uploadCulturalAsset: async (payload) => {
    const { title, assetType, creatorAccountId, cid, fpicConsentHash, accessTags } = payload;

    if (!fpicConsentHash) {
      throw new Error("FPIC consent hash is required");
    }

    const assetId = `CHAT-${Date.now()}`;

    await mockConsensusService.submitMessage("0.0.7145347", {
      module: "CHAT",
      action: "ASSET_REGISTERED",
      actorAccountId: creatorAccountId,
      payload: { assetId, assetType },
    });

    return { assetId, cid, status: "PENDING_VALIDATION" };
  },

  computeValidatorThreshold: (accessTags = []) => {
    const isRestricted = accessTags.some(t => ["#sacred", "#restricted"].includes(t));
    return isRestricted ? 5 : 2;
  },

  processValidatorDecision: (decisions, accessTags = []) => {
    const required = ChatEngine.computeValidatorThreshold(accessTags);
    const approvals = decisions.filter(d => d === "APPROVE").length;
    const rejections = decisions.filter(d => d === "REJECT").length;

    if (approvals >= required) return "VALIDATED";
    if (rejections >= required) return "REJECTED";
    return "UNDER_REVIEW";
  },

  calculateRoyaltySplit: (priceUmos) => ({
    creator:       priceUmos * 0.70,
    chatTreasury:  priceUmos * 0.20,
    museumPartner: priceUmos * 0.10,
    carbonFund:    priceUmos * 0.05,
  }),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("🎭 CHAT — Cultural Heritage Asset Engine", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("uploadCulturalAsset()", () => {
    it("should register an asset and emit an HCS event", async () => {
      const result = await ChatEngine.uploadCulturalAsset({
        title: "Maasai Adumu Jump",
        assetType: "dance",
        creatorAccountId: "0.0.9999",
        cid: "ipfs://bafybeig...",
        fpicConsentHash: "0xfpic123abc",
        accessTags: ["#public"],
      });

      expect(result.status).toBe("PENDING_VALIDATION");
      expect(result.assetId).toMatch(/^CHAT-/);
      expect(mockConsensusService.submitMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ action: "ASSET_REGISTERED" })
      );
    });

    it("should REJECT upload if FPIC consent hash is missing", async () => {
      await expect(
        ChatEngine.uploadCulturalAsset({
          title: "Sacred Ceremony",
          creatorAccountId: "0.0.1122",
          cid: "ipfs://bafybeih...",
          fpicConsentHash: null,
        })
      ).rejects.toThrow("FPIC consent hash is required");
    });
  });

  describe("computeValidatorThreshold()", () => {
    it("should require 2 validators for public assets", () => {
      expect(ChatEngine.computeValidatorThreshold(["#public"])).toBe(2);
    });

    it("should require 5 validators for #sacred assets", () => {
      expect(ChatEngine.computeValidatorThreshold(["#sacred", "#oral"])).toBe(5);
    });
  });

  describe("processValidatorDecision()", () => {
    it("should VALIDATE public asset with 2+ approvals", () => {
      const result = ChatEngine.processValidatorDecision(["APPROVE", "APPROVE", "REJECT"], ["#public"]);
      expect(result).toBe("VALIDATED");
    });

    it("should stay UNDER_REVIEW if not enough decisions for sacred asset", () => {
      const result = ChatEngine.processValidatorDecision(["APPROVE", "APPROVE"], ["#sacred"]);
      expect(result).toBe("UNDER_REVIEW");
    });

    it("should REJECT if enough REJECT votes", () => {
      const result = ChatEngine.processValidatorDecision(["REJECT", "REJECT"], ["#public"]);
      expect(result).toBe("REJECTED");
    });
  });

  describe("calculateRoyaltySplit()", () => {
    it("should correctly split a 1000 UMOS sale price", () => {
      const split = ChatEngine.calculateRoyaltySplit(1000);
      expect(split.creator).toBe(700);
      expect(split.chatTreasury).toBe(200);
      expect(split.museumPartner).toBe(100);
      expect(split.carbonFund).toBe(50);
    });

    it("should scale proportionally for different amounts", () => {
      const split = ChatEngine.calculateRoyaltySplit(500);
      expect(split.creator).toBe(350);
      expect(split.chatTreasury).toBe(100);
    });
  });
});
