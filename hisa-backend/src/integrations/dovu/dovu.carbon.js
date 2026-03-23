const axios = require("axios");
const consensusService = require("../../hedera/consensus.service");

/**
 * DOVU API client
 */
class DovuClient {
  constructor() {
    this.baseURL = process.env.DOVU_API_URL || "https://api.dovu.earth/v1";
    this.apiKey  = process.env.DOVU_API_KEY;
  }

  get headers() {
    return { "x-api-key": this.apiKey, "Content-Type": "application/json" };
  }

  async get(path, params = {}) {
    const res = await axios.get(`${this.baseURL}${path}`, { headers: this.headers, params });
    return res.data;
  }

  async post(path, body = {}) {
    const res = await axios.post(`${this.baseURL}${path}`, body, { headers: this.headers });
    return res.data;
  }
}

const dovuClient = new DovuClient();

/**
 * Full DOVU carbon credit business logic
 */
class DovuCarbon {
  /**
   * Issue a carbon credit linked to a Guardian VC
   */
  async issueCarbonCredit({ treeId, planterAccountId, guardianVcId, co2KgOffset = 10 }) {
    const projectId = process.env.DOVU_PROJECT_ID;

    const creditData = {
      projectId,
      vintage: new Date().getFullYear(),
      co2Offset: co2KgOffset,
      metadata: { guardianVcId, treeId, planterAccountId }
    };

    try {
      // In production: const result = await dovuClient.post("/credits", creditData);
      // For now, simulate response
      const mockResult = { creditId: `DOVU-${treeId}-${Date.now()}`, status: "active", co2Offset: co2KgOffset };

      await consensusService.submitMessage(process.env.POG_TOPIC_ID, {
        module: "JANI",
        action: "DOVU_CREDIT_ISSUED",
        actorAccountId: planterAccountId,
        payload: { treeId, creditId: mockResult.creditId, co2KgOffset }
      });

      return mockResult;
    } catch (error) {
      console.warn("DOVU credit issuance failed:", error.message);
      throw error;
    }
  }

  /**
   * Retire credits for corporate ESG compliance
   */
  async retireCredits({ creditIds, retirementReason, beneficiaryName }) {
    try {
      // const result = await dovuClient.post("/credits/retire", { credits: creditIds, reason: retirementReason, beneficiary: beneficiaryName });
      const mockCert = { retirementCertificateId: `CERT-${Date.now()}`, tonnesRetired: creditIds.length * 0.01 };
      return mockCert;
    } catch (error) {
      console.error("DOVU retirement failed:", error.message);
      throw error;
    }
  }
}

module.exports = new DovuCarbon();
