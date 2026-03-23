const { 
  TopicMessageSubmitTransaction 
} = require("@hashgraph/sdk");
const { client } = require("../config/hedera");
const crypto = require("crypto");

/**
 * Service for Hedera Consensus Service (HCS) operations
 */
class ConsensusService {
  /**
   * Submit a JSON message to an HCS topic
   */
  async submitMessage(topicId, messageObject) {
    try {
      const messageStr = JSON.stringify(messageObject);
      const hash = crypto.createHash("sha256").update(messageStr).digest("hex");
      
      const transaction = await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(messageStr)
        .execute(client);

      const receipt = await transaction.getReceipt(client);
      
      return { 
        success: true, 
        transactionId: transaction.transactionId.toString(), 
        sequenceNumber: receipt.topicSequenceNumber.toString(),
        consensusTimestamp: receipt.consensusTimestamp.toString(),
        hash 
      };
    } catch (error) {
      console.error("HCS Submission Error:", error);
      throw error;
    }
  }
}

module.exports = new ConsensusService();
