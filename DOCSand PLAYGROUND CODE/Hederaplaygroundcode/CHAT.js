
const {
    AccountId,
    PrivateKey,
    Client,
    AccountCreateTransaction,
    Hbar,
    TransferTransaction,
    TokenCreateTransaction,
    TokenType,
    TopicCreateTransaction
  } = require("@hashgraph/sdk"); // v2.64.5

async function main() {
  let client;
  try {
    // Your account ID and private key from string value
    const MY_ACCOUNT_ID = AccountId.fromString("0.0.5834216");
    const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA("0xbd68588b9994d1ba6d274b2e502442ab41454faf2adaca072d32928a1f4dea5d");

    // Pre-configured client for testnet
    client = Client.forTestnet();

    //Set the operator with the account ID and private key
    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

    // Start your code here
  
    
    //Generate a new key for the account
    const accountPrivateKey = PrivateKey.generateECDSA();
    const accountPublicKey = accountPrivateKey.publicKey;
    
    const txCreateAccount = new AccountCreateTransaction()
      .setECDSAKeyWithAlias(accountPrivateKey)
      //DO NOT set an alias with your key if you plan to update/rotate keys in the future, Use .setKeyWithoutAlias instead 
      //.setKeyWithoutAlias(accountPublicKey)
      .setInitialBalance(new Hbar(10));
    
    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txCreateAccountResponse = await txCreateAccount.execute(client);

    //Request the receipt of the transaction
    const receiptCreateAccountTx= await txCreateAccountResponse.getReceipt(client);

    //Get the transaction consensus status
    const statusCreateAccountTx = receiptCreateAccountTx.status;

    //Get the Account ID
    const accountId = receiptCreateAccountTx.accountId;

    //Get the Transaction ID 
    const txIdAccountCreated = txCreateAccountResponse.transactionId.toString();

    console.log("------------------------------ Create Account ------------------------------ ");
    console.log("Receipt status       :", statusCreateAccountTx.toString());
    console.log("Transaction ID       :", txIdAccountCreated);
    console.log("Hashscan URL         :", `https://hashscan.io/testnet/transaction/${txIdAccountCreated}`);
    console.log("Account ID           :", accountId.toString());
    console.log("EVM Address          :", `0x${accountPublicKey.toEvmAddress()}`);
    console.log("Private key          :", `0x${accountPrivateKey.toStringRaw()}`);
    console.log("Public key           :", `0x${accountPublicKey.toStringRaw()}`);
    
  
    
    //Create a transaction to transfer 1 HBAR
    const txTransfer= new TransferTransaction()
      .addHbarTransfer(MY_ACCOUNT_ID, new Hbar(-1))
      .addHbarTransfer(receiverAccount, new Hbar(1)); //Fill in the receiver account ID
          
    //Submit the transaction to a Hedera network
    const txTransferResponse = await txTransfer.execute(client);

    //Request the receipt of the transaction
    const receiptTransferTx = await txTransferResponse.getReceipt(client);

    //Get the transaction consensus status
    const statusTransferTx= receiptTransferTx.status;

    //Get the Transaction ID
    const txIdTransfer = txTransferResponse.transactionId.toString();

    console.log("-------------------------------- Transfer HBAR ------------------------------ ");
    console.log("Receipt status           :", statusTransferTx.toString());
    console.log("Transaction ID           :", txIdTransfer);
    console.log("Hashscan URL             :", `https://hashscan.io/testnet/transaction/${txIdTransfer}`);
      
  
    
    //Create the transaction and freeze for manual signing
    const txTokenCreate = await new TokenCreateTransaction()
      .setTokenName("Culture Heritage Asset Token")
      .setTokenSymbol(" CHAT ")
      .setTokenType(TokenType.FungibleCommon)
      .setTreasuryAccountId(MY_ACCOUNT_ID)
      .setInitialSupply(50000000)
      .freezeWith(client);

    //Sign the transaction with the token treasury account private key
    const signTxTokenCreate =  await txTokenCreate.sign(MY_PRIVATE_KEY);

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txTokenCreateResponse = await signTxTokenCreate.execute(client);

    //Get the receipt of the transaction
    const receiptTokenCreateTx = await txTokenCreateResponse.getReceipt(client);

    //Get the token ID from the receipt
    const tokenId = receiptTokenCreateTx.tokenId;

    //Get the transaction consensus status
    const statusTokenCreateTx = receiptTokenCreateTx.status;

    //Get the Transaction ID
    const txTokenCreateId = txTokenCreateResponse.transactionId.toString();

    console.log("--------------------------------- Token Creation ---------------------------------");
    console.log("Receipt status           :", statusTokenCreateTx.toString());
    console.log("Transaction ID           :", txTokenCreateId);
    console.log("Hashscan URL             :", "https://hashscan.io/testnet/transaction/" + txTokenCreateId);
    console.log("Token ID                 :", tokenId.toString());
    
  
    
    //Create the transaction
    const txCreateTopic = new TopicCreateTransaction();

    //Sign with the client operator private key and submit the transaction to a Hedera network
    const txCreateTopicResponse = await txCreateTopic.execute(client);

    //Request the receipt of the transaction
    const receiptCreateTopicTx = await txCreateTopicResponse.getReceipt(client);

    //Get the transaction consensus status
    const statusCreateTopicTx = receiptCreateTopicTx.status;

    //Get the Transaction ID
    const txCreateTopicId = txCreateTopicResponse.transactionId.toString();

    //Get the topic ID
    const topicId = receiptCreateTopicTx.topicId.toString();

    console.log("------------------------------ Create Topic ------------------------------ ");
    console.log("Receipt status           :", statusCreateTopicTx.toString());
    console.log("Transaction ID           :", txCreateTopicId);
    console.log("Hashscan URL             :", "https://hashscan.io/testnet/transaction/" + txCreateTopicId);
    console.log("Topic ID                 :", topicId);
      
  } catch (error) {
    console.error(error);
  } finally {
    if (client) client.close();
  }
}