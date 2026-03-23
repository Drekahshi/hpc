const { 
  TransferTransaction, 
  TokenMintTransaction, 
  TokenBurnTransaction, 
  TokenAssociateTransaction, 
  AccountBalanceQuery,
  Hbar
} = require("@hashgraph/sdk");
const { client, operatorId } = require("../config/hedera");

/**
 * Service for Hedera Token Service (HTS) operations
 */
class TokenService {
  /**
   * Mint fungible tokens and transfer to receiver
   */
  async mintFungibleTokens(tokenId, amount, receiverAccountId) {
    try {
      const transaction = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(amount)
        .execute(client);

      const receipt = await transaction.getReceipt(client);

      // Transfer from treasury to receiver if specified
      if (receiverAccountId && receiverAccountId !== operatorId.toString()) {
        await new TransferTransaction()
          .addTokenTransfer(tokenId, operatorId, -amount)
          .addTokenTransfer(tokenId, receiverAccountId, amount)
          .execute(client);
      }

      return { success: true, transactionId: transaction.transactionId.toString(), receipt };
    } catch (error) {
      console.error("Minting Error:", error);
      throw error;
    }
  }

  /**
   * Transfer tokens between accounts
   */
  async transferTokens(tokenId, fromAccountId, toAccountId, amount) {
    try {
      const transaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, fromAccountId, -amount)
        .addTokenTransfer(tokenId, toAccountId, amount)
        .execute(client);

      const receipt = await transaction.getReceipt(client);
      return { success: true, transactionId: transaction.transactionId.toString(), receipt };
    } catch (error) {
      console.error("Transfer Error:", error);
      throw error;
    }
  }

  /**
   * Get token balance for an account
   */
  async getTokenBalance(accountId, tokenId) {
    try {
      const query = new AccountBalanceQuery().setAccountId(accountId);
      const balance = await query.execute(client);
      return balance.tokens.get(tokenId).toNumber();
    } catch (error) {
      console.error("Balance Query Error:", error);
      throw error;
    }
  }

  /**
   * Associate a token with an account
   */
  async associateToken(accountId, tokenId, accountKey) {
    try {
      const transaction = await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId])
        .freezeWith(client);
      
      const signedTx = await transaction.sign(accountKey);
      const response = await signedTx.execute(client);
      const receipt = await response.getReceipt(client);
      
      return { success: true, transactionId: response.transactionId.toString(), receipt };
    } catch (error) {
      console.error("Association Error:", error);
      throw error;
    }
  }
}

module.exports = new TokenService();
