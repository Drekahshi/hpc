// src/app/balance/hbar-actions.ts
'use server';

import { Client, AccountBalanceQuery, AccountId } from '@hashgraph/sdk';

export type TokenBalance = {
    tokenId: string;
    balance: number;
    decimals: number;
};

export type AllBalances = {
    hbar: string;
    tokens: TokenBalance[];
}

export async function getAllBalances(accountId: string): Promise<AllBalances> {
    if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
        throw new Error('Hedera operator ID and key are not configured in environment variables.');
    }

    try {
        const client = Client.forTestnet().setOperator(
            process.env.HEDERA_OPERATOR_ID,
            process.env.HEDERA_OPERATOR_KEY
        );
        
        const account = AccountId.fromString(accountId);

        const accountBalance = await new AccountBalanceQuery()
            .setAccountId(account)
            .execute(client);
        
        const tokenBalances: TokenBalance[] = [];
        if (accountBalance.tokens) {
            for (const [tokenId, balance] of accountBalance.tokens._map) {
                // This is a simplified version. A full implementation would query token info for decimals.
                // For now, let's assume no decimals or fetch it if needed.
                // For this example, we'll hardcode decimals for known tokens if any, or assume 0.
                // This part might need a TokenInfoQuery if you have custom tokens.
                tokenBalances.push({
                    tokenId: tokenId.toString(),
                    balance: balance.toNumber(), // Note: this will lose precision for large numbers
                    decimals: 0, // Assuming 0 decimals for simplicity. Query TokenInfo for real value.
                });
            }
        }
        
        return {
            hbar: accountBalance.hbars.toString(),
            tokens: tokenBalances
        };
    } catch (error) {
        console.error('Error fetching balances:', error);
        if (error instanceof Error && error.message.includes('INVALID_ACCOUNT_ID')) {
            throw new Error(`The account ID "${accountId}" is not valid on the Hedera network.`);
        }
        throw new Error('Failed to fetch balances from Hedera network.');
    }
}
