const guardianClient = require("./guardian.client");

/**
 * Service for Guardian MRV (Monitoring, Reporting, and Verification) data submission
 */
class GuardianMRV {
  /**
   * Submit conservation MRV data to trigger credential issuance
   */
  async submitConservationMRV(mrvData) {
    const policyId = process.env.GUARDIAN_CARBON_POLICY_ID;
    const mrvBlockId = process.env.GUARDIAN_MRV_BLOCK_ID;

    if (!policyId || !mrvBlockId) {
      throw new Error("Guardian policy configuration missing in environment");
    }

    try {
      // Submit data to the specific policy block
      const response = await guardianClient.post(
        `/policies/${policyId}/blocks/${mrvBlockId}`,
        { 
          document: mrvData, 
          documentStatus: "Issue" 
        }
      );

      // In a real scenario, we might want to poll for the VC issuance 
      // or rely on a webhook/sync worker.
      return { 
        success: true, 
        guardianResponse: response 
      };
    } catch (error) {
      console.error("Guardian MRV submission error:", error);
      throw error;
    }
  }
}

module.exports = new GuardianMRV();
