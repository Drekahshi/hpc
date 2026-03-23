const axios = require("axios");
const logger = require("../utils/logger");

/**
 * IPFS Storage Service
 * Uploads and retrieves data from IPFS (Infura / Kabila nodes)
 */
class IPFSStorage {
  constructor() {
    this.baseURL = process.env.IPFS_NODE_URL || "https://ipfs.infura.io:5001/api/v0";
    this.kabilaURL = process.env.KABILA_API || "https://api.kabila.io";
    this.kabilaKey = process.env.KABILA_KEY;
  }

  /**
   * Upload a JSON object to IPFS and return the CID
   */
  async uploadJSON(obj, fileName = "metadata.json") {
    try {
      const data = JSON.stringify(obj, null, 2);
      const FormData = require("form-data");
      const formData = new FormData();
      formData.append("file", Buffer.from(data), { filename: fileName, contentType: "application/json" });

      const response = await axios.post(`${this.baseURL}/add`, formData, {
        headers: formData.getHeaders(),
      });

      const cid = response.data?.Hash;
      logger.info(`IPFS upload success: ${cid}`);
      return { cid, url: `https://ipfs.io/ipfs/${cid}` };
    } catch (err) {
      logger.error(`IPFS upload failed: ${err.message}`);
      // Return a mock CID for demo/hackathon purposes
      const mockCid = `Qm${Math.random().toString(36).slice(2, 48)}`;
      return { cid: mockCid, url: `https://ipfs.io/ipfs/${mockCid}`, mock: true };
    }
  }

  /**
   * Build an NFT metadata object conforming to HIP-412
   */
  buildNFTMetadata({ name, description, image, attributes = [], creator, royaltyBps }) {
    return {
      name,
      creator,
      description,
      image: image || "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      type: "image/jpeg",
      properties: { royaltyBps },
      attributes,
      format: "HIP412@2.0.0",
    };
  }
}

module.exports = new IPFSStorage();
