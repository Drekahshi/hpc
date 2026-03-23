const dovuCarbon = require("./dovu.carbon");
const TreeRecord = require("../../modules/jani/jani.model");
const consensusService = require("../../hedera/consensus.service");

/**
 * Bridge between JANI token events and DOVU carbon credits
 */
class DovuBridge {
  /**
   * Called automatically after PoG minting + Guardian VC issuance
   */
  async onJaniTokenMinted(treeId, planterAccountId, guardianVcId) {
    const creditResult = await dovuCarbon.issueCarbonCredit({
      treeId, planterAccountId, guardianVcId, co2KgOffset: 10
    });

    // Store credit ID on tree record
    await TreeRecord.findOneAndUpdate({ treeId }, { dovuCreditId: creditResult.creditId });

    return creditResult;
  }

  /**
   * Corporate purchase webhook handler
   */
  async onCorporatePurchase(webhookPayload) {
    const { creditId, buyerName, purchasedKgCO2, revenueUSD } = webhookPayload;

    // Find related tree record
    const tree = await TreeRecord.findOne({ dovuCreditId: creditId });

    await consensusService.submitMessage(process.env.POG_TOPIC_ID, {
      module: "JANI",
      action: "CORPORATE_ESG_PURCHASE",
      actorAccountId: "CORPORATE",
      payload: { creditId, buyerName, purchasedKgCO2, revenueUSD }
    });

    // Retire the credits
    await dovuCarbon.retireCredits({
      creditIds: [creditId],
      retirementReason: `Corporate ESG purchase by ${buyerName}`,
      beneficiaryName: buyerName
    });

    return { success: true, treeId: tree?.treeId };
  }
}

module.exports = new DovuBridge();
