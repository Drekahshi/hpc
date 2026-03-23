const CulturalAsset = require("./chat.model");
const consensusService = require("../../hedera/consensus.service");
const tokenService = require("../../hedera/token.service");

/**
 * Validator Council logic for CHAT module
 */
class ValidatorCouncil {
  /**
   * Submit an asset for validation (select validators, set status)
   */
  async submitForValidation(assetId) {
    const asset = await CulturalAsset.findOne({ assetId });
    if (!asset) throw new Error("Asset not found");

    asset.status = "UNDER_REVIEW";
    await asset.save();

    await consensusService.submitMessage(process.env.UCSE_TOPIC_ID || process.env.POG_TOPIC_ID, {
      module: "CHAT",
      action: "ASSET_SUBMITTED_FOR_REVIEW",
      actorAccountId: asset.creatorAccountId,
      payload: { assetId, title: asset.title }
    });

    return asset;
  }

  /**
   * A validator submits their decision on an asset
   */
  async submitValidatorDecision(assetId, validatorAccountId, decision, reason, accessTag) {
    const asset = await CulturalAsset.findOne({ assetId });
    if (!asset || asset.status !== "UNDER_REVIEW") {
      throw new Error("Asset not available for decision");
    }

    asset.validationDecisions.push({
      validatorAccountId,
      decision,
      reason,
      accessTagSuggested: accessTag,
      decidedAt: new Date()
    });

    // Determine consensus (2-of-3 majority for standard, 5-of-7 for sensitive)
    const isSensitive = asset.accessTags.includes("#sacred") || asset.accessTags.includes("#restricted");
    const requiredApprovals = isSensitive ? 5 : 2;
    const approvals = asset.validationDecisions.filter(d => d.decision === "APPROVE").length;
    const rejections = asset.validationDecisions.filter(d => d.decision === "REJECT").length;

    if (approvals >= requiredApprovals) {
      asset.status = "VALIDATED";
    } else if (rejections >= requiredApprovals) {
      asset.status = "REJECTED";
    }

    await asset.save();
    return asset;
  }
}

module.exports = new ValidatorCouncil();
