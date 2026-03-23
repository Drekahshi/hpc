const { WellnessRecord, SDGImpactRecord } = require("./hisa.model");
const tokenService = require("../../hedera/token.service");
const consensusService = require("../../hedera/consensus.service");

const DISTRIBUTION_MAP = {
  JANI_TREE_PLANT:    { JANI: 0.70, HISA: 0.20, COMMUNITY: 0.10 },
  CHAT_ASSET_UPLOAD:  { CHAT: 0.70, HISA: 0.20, COMMUNITY: 0.10 },
  UMOJA_STAKING:      { UMOJA: 0.80, HISA: 0.10, COMMUNITY: 0.10 },
  HISA_WELLNESS:      { HISA: 0.90, COMMUNITY: 0.10 },
};

/**
 * Full HISA Wellness & SDG Engine
 */
class WellnessEngine {
  /**
   * Submit a wellness check-in
   */
  async submitWellnessCheckIn(checkInData) {
    const { accountId, selfAssessmentScore, categories, encryptedHealthData, consentHash } = checkInData;

    // Calculate reward with consistency multiplier (simplified)
    const baseReward = 5;
    const rewardAmount = baseReward;

    const record = new WellnessRecord({
      accountId,
      selfAssessmentScore,
      categories: categories || [],
      encryptedData: encryptedHealthData,
      rewardMinted: rewardAmount,
      riskFlag: selfAssessmentScore <= 3
    });

    await record.save();

    // Mint HISA reward
    await tokenService.mintFungibleTokens(process.env.HISA_TOKEN_ID, rewardAmount, accountId);

    let careRecommendation = null;
    if (selfAssessmentScore <= 3) {
      careRecommendation = "We noticed you rated today low. Consider connecting with a wellness professional.";
    }

    return { checkInId: record._id, rewardAmount, careRecommendation };
  }

  /**
   * Record an SDG action and distribute cross-module rewards
   */
  async recordSDGAction(sdgData) {
    const { accountId, actionType, moduleSource, verificationHash, impactMetric } = sdgData;

    const distribution = DISTRIBUTION_MAP[actionType] || { HISA: 1.0 };
    const totalReward = 10; // base tokens per action

    const tokensDistributed = {};
    for (const [token, share] of Object.entries(distribution)) {
      if (token !== "COMMUNITY") {
        const amount = Math.round(totalReward * share);
        const tokenEnvKey = `${token}_TOKEN_ID`;
        if (process.env[tokenEnvKey]) {
          await tokenService.mintFungibleTokens(process.env[tokenEnvKey], amount, accountId);
          tokensDistributed[token] = amount;
        }
      }
    }

    const sdgRecord = new SDGImpactRecord({
      accountId, actionType, moduleSource,
      verificationHash, impactMetric,
      tokensDistributed
    });
    await sdgRecord.save();

    await consensusService.submitMessage(process.env.POG_TOPIC_ID, {
      module: "HISA",
      action: "SDG_ACTION_RECORDED",
      actorAccountId: accountId,
      payload: { actionType, tokensDistributed }
    });

    return { sdgRecordId: sdgRecord._id, tokensDistributed };
  }

  /**
   * Get SDG dashboard metrics
   */
  async getSDGDashboard(accountId) {
    const query = accountId ? { accountId } : {};
    const records = await SDGImpactRecord.find(query);
    const metrics = records.reduce((acc, r) => {
      const goal = r.sdgGoal || 0;
      if (!acc[goal]) acc[goal] = { actions: 0, tokensEarned: {} };
      acc[goal].actions++;
      return acc;
    }, {});
    return { sdgMetrics: metrics, totalActions: records.length };
  }
}

module.exports = new WellnessEngine();
