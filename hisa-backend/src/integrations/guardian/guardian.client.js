const axios = require("axios");

/**
 * Client for Hedera Guardian REST API
 */
class GuardianClient {
  constructor() {
    this.baseURL = process.env.GUARDIAN_API_URL;
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Authenticate with the Guardian API
   */
  async authenticate() {
    try {
      const response = await axios.post(`${this.baseURL}/accounts/login`, {
        username: process.env.GUARDIAN_USERNAME,
        password: process.env.GUARDIAN_PASSWORD
      });
      
      this.token = response.data.accessToken;
      // Set expiry to 55 minutes for safety
      this.tokenExpiry = Date.now() + 55 * 60 * 1000;
      
      return this.token;
    } catch (error) {
      console.error("Guardian Authentication Error:", error);
      throw new Error("Failed to authenticate with Guardian");
    }
  }

  /**
   * Get authentication headers
   */
  async getAuthHeader() {
    if (!this.token || Date.now() > this.tokenExpiry) {
      await this.authenticate();
    }
    return { Authorization: `Bearer ${this.token}` };
  }

  /**
   * Perform an authenticated POST request
   */
  async post(path, body) {
    try {
      const headers = await this.getAuthHeader();
      const response = await axios.post(`${this.baseURL}${path}`, body, { headers });
      return response.data;
    } catch (error) {
      console.error(`Guardian POST ${path} Error:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Perform an authenticated GET request
   */
  async get(path, params = {}) {
    try {
      const headers = await this.getAuthHeader();
      const response = await axios.get(`${this.baseURL}${path}`, { headers, params });
      return response.data;
    } catch (error) {
      console.error(`Guardian GET ${path} Error:`, error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new GuardianClient();
