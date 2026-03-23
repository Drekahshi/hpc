// src/ai/flows/token-balance-inquiry.ts
'use server';

/**
 * @fileOverview An AI agent for querying JANI token balances.
 *
 * - getTokenBalance - A function that handles the token balance inquiry process.
 * - TokenBalanceInquiryInput - The input type for the getTokenBalance function.
 * - TokenBalanceInquiryOutput - The return type for the getTokenBalance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TokenBalanceInquiryInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to query.'),
});
export type TokenBalanceInquiryInput = z.infer<typeof TokenBalanceInquiryInputSchema>;

const TokenBalanceInquiryOutputSchema = z.object({
  tokenBalance: z.number().describe('The JANI token balance for the specified project.'),
});
export type TokenBalanceInquiryOutput = z.infer<typeof TokenBalanceInquiryOutputSchema>;

export async function getTokenBalance(input: TokenBalanceInquiryInput): Promise<TokenBalanceInquiryOutput> {
  return tokenBalanceInquiryFlow(input);
}

const getTokenBalancePrompt = ai.definePrompt({
  name: 'getTokenBalancePrompt',
  input: {schema: TokenBalanceInquiryInputSchema},
  output: {schema: TokenBalanceInquiryOutputSchema},
  prompt: `You are an AI agent that can query the JANI token balances associated with specific projects.

  Given the project ID, return the current JANI token balance.

  Project ID: {{{projectId}}}
  `,
});

const tokenBalanceInquiryFlow = ai.defineFlow(
  {
    name: 'tokenBalanceInquiryFlow',
    inputSchema: TokenBalanceInquiryInputSchema,
    outputSchema: TokenBalanceInquiryOutputSchema,
  },
  async input => {
    // Here, in a real implementation, you would likely call a service
    // to fetch the token balance from a database or blockchain.
    // For this example, we'll just return a static value.
    const {output} = await getTokenBalancePrompt(input);
    return output!;
  }
);
