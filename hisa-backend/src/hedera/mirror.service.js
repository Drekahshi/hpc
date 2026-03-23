const axios = require("axios");

/**
 * Service for interacting with Hedera Mirror Node REST API
 */
class MirrorService {
  constructor() {
    this.baseURL = process.env.MIRROR_NODE_URL || "https://testnet.mirrornode.hedera.com/api/v1";
  }

  /**
   * Get token balances for an account
   */
  async getAccountTokens(accountId) {
    try {
      const response = await axios.get(`${this.baseURL}/accounts/${accountId}/tokens`);
      return response.data;
    } catch (error) {
      console.error("Mirror Node API Error (getAccountTokens):", error.message);
      throw error;
    }
  }

  /**
   * Get transaction history for an account
   */
  async getAccountTransactions(accountId, limit = 25) {
    try {
      const response = await axios.get(`${this.baseURL}/accounts/${accountId}/transactions`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error("Mirror Node API Error (getAccountTransactions):", error.message);
      throw error;
    }
  }

  /**
   * Get messages from an HCS topic
   */
  async getTopicMessages(topicId, limit = 25) {
    try {
      const response = await axios.get(`${this.baseURL}/topics/${topicId}/messages`, {
        params: { limit, order: "desc" }
      });
      return response.data;
    } catch (error) {
      console.error("Mirror Node API Error (getTopicMessages):", error.message);
      throw error;
    }
  }

  /**
   * Get current HBAR price from Mirror Node exchange rate
   */
  async getHBARPrice() {
    try {
      const response = await axios.get(`${this.baseURL}/network/exchangerate`);
      const rate = response.data.current_rate;
      return rate.cent_equivalent / rate.hbar_equivalent / 100;
    } catch (error) {
      console.error("Mirror Node API Error (getHBARPrice):", error.message);
      return null;
    }
  }
}

module.exports = new MirrorService();
