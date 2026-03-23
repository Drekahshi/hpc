'use server';

import { z } from 'zod';
import { getBalance } from '@/lib/db';

const formSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required.'),
});

type BalanceState = {
  data: {
    tokenBalance: number;
    accountId: string;
  } | null;
  error: string | null;
};

export async function handleBalanceInquiry(prevState: BalanceState, formData: FormData): Promise<BalanceState> {
  try {
    const parsed = formSchema.safeParse({
      accountId: formData.get('accountId'),
    });

    if (!parsed.success) {
      return {
        data: null,
        error: parsed.error.errors.map((e) => e.message).join(', '),
      };
    }
    const { accountId } = parsed.data;

    const balance = getBalance(accountId);

    return { data: { tokenBalance: balance, accountId }, error: null };
  } catch (error) {
    console.error('Balance Inquiry Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to get token balance: ${errorMessage}` };
  }
}