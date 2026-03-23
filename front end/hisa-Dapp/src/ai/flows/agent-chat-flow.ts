// src/ai/flows/agent-chat-flow.ts
'use server';

/**
 * @fileOverview An AI agent for answering questions about the Hisa ecosystem.
 *
 * - agentChat - A function that handles answering questions.
 * - AgentChatInput - The input type for the agentChat function.
 * - AgentChatOutput - The return type for the agentChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Mock data for token balances
const tokenBalances = {
  jani: {
    'JANI': 10482,
    'Validator Wallets': 500,
  },
  umoja: {
    'UMOJA': 2000000,
    'UMOS': 300000000,
    'UMOO': 10000000000,
  },
  culture: {
    'CHAT': 21450,
  },
};

const AgentChatInputSchema = z.object({
  ecosystem: z.enum(['jani', 'umoja', 'culture']).describe('The current ecosystem context.'),
  question: z.string().describe('The user\'s question.'),
});
export type AgentChatInput = z.infer<typeof AgentChatInputSchema>;

const AgentChatOutputSchema = z.object({
  answer: z.string().describe('The AI agent\'s answer to the question.'),
});
export type AgentChatOutput = z.infer<typeof AgentChatOutputSchema>;

export async function agentChat(input: AgentChatInput): Promise<AgentChatOutput> {
  return agentChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agentChatPrompt',
  input: { schema: AgentChatInputSchema },
  output: { schema: AgentChatOutputSchema },
  prompt: `You are a helpful AI assistant for the Hisa Peoples Chain, a blockchain ecosystem.
You are currently acting as an agent for the '{{{ecosystem}}}' ecosystem.

You have access to the following token balance information:
JANI Ecosystem:
- JANI Tokens Minted: ${tokenBalances.jani.JANI}
- A connected wallet has: ${tokenBalances.jani['Validator Wallets']} JANI

Umoja Ecosystem:
- UMOJA Balance: ${tokenBalances.umoja.UMOJA}
- UMOS (Umoja Stable) Balance: ${tokenBalances.umoja.UMOS}
- UMOO (Umoja Option) Balance: ${tokenBalances.umoja.UMOO}

Culture Ecosystem:
- CHAT Balance: ${tokenBalances.culture.CHAT}

Based on the current ecosystem ('{{{ecosystem}}}') and the token data, answer the user's question. Be friendly and concise.

User Question: {{{question}}}
`,
});

const agentChatFlow = ai.defineFlow(
  {
    name: 'agentChatFlow',
    inputSchema: AgentChatInputSchema,
    outputSchema: AgentChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
