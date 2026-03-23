const CulturalAsset = require("./chat.model");
const validatorCouncil = require("./validator.council");
const consensusService = require("../../hedera/consensus.service");
const tokenService = require("../../hedera/token.service");

/**
 * Full CHAT module service
 */
class ChatService {
  /**
   * Upload a cultural asset
   */
  async uploadCulturalAsset(uploadData) {
    const { title, description, assetType, tribalAttribution, geoTag, language,
            creatorAccountId, cid, accessTags, fpicConsentHash } = uploadData;

    if (!fpicConsentHash) {
      throw new Error("FPIC consent hash is required");
    }

    const asset = new CulturalAsset({
      assetId: `CHAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title, description, assetType, tribalAttribution,
      geoTag, language, creatorAccountId,
      cid, accessTags, fpicConsentHash,
      status: "PENDING_VALIDATION"
    });

    await asset.save();

    await consensusService.submitMessage(process.env.POG_TOPIC_ID, {
      module: "CHAT",
      action: "ASSET_REGISTERED",
      actorAccountId: creatorAccountId,
      payload: { assetId: asset.assetId, assetType, tribalAttribution }
    });

    // Auto-submit for validation
    await validatorCouncil.submitForValidation(asset.assetId);

    return { assetId: asset.assetId, cid, status: asset.status };
  }

  /**
   * Mint a Cultural NFT for a validated asset
   */
  async mintCulturalNFT(assetId) {
    const asset = await CulturalAsset.findOne({ assetId });
    if (!asset || asset.status !== "VALIDATED") {
      throw new Error("Asset must be VALIDATED before minting");
    }

    const metadataBuffer = Buffer.from(JSON.stringify({
      title: asset.title,
      creator: asset.creatorAccountId,
      cid: asset.cid,
      tribalAttribution: asset.tribalAttribution,
      royaltyBps: asset.royaltyBps
    }));

    const mintResult = await tokenService.mintFungibleTokens(
      process.env.CHAT_TOKEN_ID,
      1,
      asset.creatorAccountId
    );

    asset.status = "MINTED";
    await asset.save();

    return { nftSerial: mintResult.transactionId, assetId };
  }

  /**
   * Calculate royalty split for secondary sales
   */
  calculateRoyaltySplit(priceUmos) {
    return {
      creator:      priceUmos * 0.70,
      chatTreasury: priceUmos * 0.20,
      museumPartner:priceUmos * 0.10,
      carbonFund:   priceUmos * 0.05  // Additional 5% royalty
    };
  }
}

module.exports = new ChatService();
