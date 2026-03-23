const { ChatOpenAI } = require("@langchain/openai");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const logger = require("../utils/logger");

const llm = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || "gpt-4o",
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const JANI_SYSTEM_PROMPT = `You are KAI, the HISA Ecosystem AI Agent.
Your role is to help rural community members:
1. Register trees for the Proof-of-Growth (PoG) programme.
2. Submit wellness check-ins to earn HISA tokens.
3. Understand how to tokenize cultural assets through CHAT.
4. Query their token balances and SDG contribution metrics.
Keep your responses brief, clear, and friendly. When asked about tokens, mention real Hedera account IDs.`;

/**
 * Run a natural language query through KAI, the HISA AI Agent
 */
async function runKAIQuery(userMessage, context = {}) {
  logger.info(`KAI Query: "${userMessage}"`);

  const messages = [
    new SystemMessage(JANI_SYSTEM_PROMPT),
    new HumanMessage(userMessage),
  ];

  try {
    const response = await llm.invoke(messages);
    return { success: true, reply: response.content };
  } catch (err) {
    logger.error(`KAI LLM Error: ${err.message}`);
    return { success: false, reply: "I am temporarily unavailable. Please try again shortly." };
  }
}

/**
 * Explain a Hedera transaction to a user in plain language
 */
async function explainTransaction(txRecord) {
  const prompt = `Explain this Hedera transaction in 2 sentences for a non-technical user: ${JSON.stringify(txRecord)}`;
  return runKAIQuery(prompt);
}

module.exports = { runKAIQuery, explainTransaction };
