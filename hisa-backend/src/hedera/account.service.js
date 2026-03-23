const {
  AccountCreateTransaction,
  AccountUpdateTransaction,
  AccountInfoQuery,
  ScheduleCreateTransaction,
  ScheduleSignTransaction,
  ScheduleInfoQuery,
  KeyList,
  PrivateKey,
  Hbar
} = require("@hashgraph/sdk");
const { client } = require("../config/hedera");

/**
 * Service for Hedera Account lifecycle and Scheduled transactions
 */
class AccountService {
  /**
   * Create a new user account on Hedera
   */
  async createUserAccount(initialBalanceHbar = 1) {
    try {
      const privateKey = PrivateKey.generateED25519();
      const publicKey = privateKey.publicKey;

      const transaction = await new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(new Hbar(initialBalanceHbar))
        .setMaxAutomaticTokenAssociations(10)
        .execute(client);

      const receipt = await transaction.getReceipt(client);
      const newAccountId = receipt.accountId;

      return { 
        success: true, 
        accountId: newAccountId.toString(), 
        publicKey: publicKey.toString(), 
        privateKey: privateKey.toString() // Return once, never store plaintext
      };
    } catch (error) {
      console.error("Account Creation Error:", error);
      throw error;
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo(accountId) {
    try {
      const query = new AccountInfoQuery().setAccountId(accountId);
      const info = await query.execute(client);
      return info;
    } catch (error) {
      console.error("Account Info Error:", error);
      throw error;
    }
  }

  /**
   * Schedule a transaction for later execution or multi-sig
   */
  async scheduleTransaction(transaction, payerAccountId) {
    try {
      const scheduledBox = new ScheduleCreateTransaction()
        .setScheduledTransaction(transaction)
        .setPayerAccountId(payerAccountId)
        .execute(client);
      
      const receipt = await (await scheduledBox).getReceipt(client);
      return { success: true, scheduleId: receipt.scheduleId.toString() };
    } catch (error) {
      console.error("Schedule Transaction Error:", error);
      throw error;
    }
  }
}

module.exports = new AccountService();
