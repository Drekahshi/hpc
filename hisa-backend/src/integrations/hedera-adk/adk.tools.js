const { Tool } = require("langchain/tools");
const pogEngine = require("../../modules/jani/pog.engine");
const guardianMRV = require("../guardian/guardian.mrv");

/**
 * Custom tool for JANI tree verification and minting
 */
const verifyTreeTool = {
  name: "verify_tree_and_mint_jani",
  description: "Checks if a tree record is eligible for JANI token minting. Input: JSON string with treeId.",
  func: async (input) => {
    try {
      const { treeId } = JSON.parse(input);
      // In a real scenario, we'd call checkMintingEligibility
      // For now, we'll use the minting logic which has checks.
      const result = await pogEngine.mintJaniToken(treeId);
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message });
    }
  }
};

/**
 * Custom tool for Guardian credential issuance
 */
const issueCredentialTool = {
  name: "issue_guardian_credential",
  description: "Issues a Verifiable Credential through Hedera Guardian. Input: JSON with { treeId }.",
  func: async (input) => {
    try {
      const { treeId } = JSON.parse(input);
      // This tool would typically be called by the agent after minting if MRV is async.
      // For now, we'll wrap the MRV submission.
      const result = await guardianMRV.submitConservationMRV({ treeId });
      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message });
    }
  }
};

module.exports = [verifyTreeTool, issueCredentialTool];
