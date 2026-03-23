const TreeRecord = require("./jani.model");
const tokenService = require("../../hedera/token.service");
const consensusService = require("../../hedera/consensus.service");
const guardianMRV = require("../../integrations/guardian/guardian.mrv");

/**
 * Proof-of-Growth (PoG) Engine core logic
 */
class PoGEngine {
  /**
   * Register a new planting intent
   */
  async registerPlantingIntent(intentData) {
    const { nurseryId, species, gps, plantedBy } = intentData;
    
    const treeRecord = new TreeRecord({
      treeId: `TREE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      nurseryId,
      species,
      gps,
      planterAccountId: plantedBy,
      status: "PENDING"
    });

    await treeRecord.save();

    // Log intent to HCS
    await consensusService.submitMessage(process.env.POG_TOPIC_ID, {
      module: "JANI",
      action: "PLANTING_INTENT_REGISTERED",
      actorAccountId: plantedBy,
      payload: { treeId: treeRecord.treeId, gps, species }
    });

    return treeRecord;
  }

  /**
   * Submit planting verification (AI or human)
   */
  async submitPlantingVerification(treeId, verificationData) {
    const tree = await TreeRecord.findOne({ treeId });
    if (!tree) throw new Error("Tree not found");

    tree.verifications.push(verificationData);
    
    // Simple logic: if at least 1 verification exists (e.g. from JANI AI), update status
    // In production, we'd require multiple and/or specific roles.
    if (tree.verifications.length >= 1) {
      tree.status = "VERIFIED_PLANTED";
    }

    await tree.save();

    // Log verification to HCS
    await consensusService.submitMessage(process.env.POG_TOPIC_ID, {
      module: "JANI",
      action: "PLANTING_VERIFIED",
      actorAccountId: verificationData.validatorAccountId,
      payload: { treeId, status: tree.status }
    });

    return tree;
  }

  /**
   * Mint JANI token and trigger Guardian MRV
   */
  async mintJaniToken(treeId) {
    const tree = await TreeRecord.findOne({ treeId });
    if (!tree || tree.status !== "VERIFIED_PLANTED") {
      throw new Error("Tree is not eligible for minting");
    }

    // 1. Mint 1 JANI via HTS
    const mintResult = await tokenService.mintFungibleTokens(
      process.env.JANI_TOKEN_ID, 
      1, 
      tree.planterAccountId
    );

    tree.status = "TOKEN_MINTED";
    tree.janiTokenMintedAt = new Date();
    await tree.save();

    // 2. Submit to Guardian MRV
    try {
      await guardianMRV.submitConservationMRV({
        treeId: tree.treeId,
        planterAccountId: tree.planterAccountId,
        species: tree.species,
        gps: tree.gps,
        hcsTransactionId: mintResult.transactionId
      });
    } catch (error) {
      console.warn("Guardian submission failed, but token was minted:", error.message);
    }

    return { tree, mintResult };
  }
}

module.exports = new PoGEngine();
