
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleBalanceInquiry } from './actions';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CircleDollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { useEffect, useState } from 'react';
import { getAllBalances, AllBalances, TokenBalance } from './hbar-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';


const initialState = {
  data: null,
  error: null,
};

const databaseEntries = [
  {
    treeId: 'T1234',
    species: 'Acacia',
    walletId: '0.0.567890',
    validator: 'Austin',
    status: 'Growing',
    timestamp: '2024-05-22 10:00 AM',
  },
  {
    treeId: 'T1235',
    species: 'Oak',
    walletId: '0.0.123456',
    validator: 'Chloe',
    status: 'Growing',
    timestamp: '2024-05-22 09:45 AM',
  },
  {
    treeId: 'T1236',
    species: 'Bamboo',
    walletId: '0.0.789012',
    validator: 'Marcus',
    status: 'Needs Attention',
    timestamp: '2024-05-21 03:30 PM',
  },
  {
    treeId: 'T1237',
    species: 'Maple',
    walletId: '0.0.345678',
    validator: 'Sofia',
    status: 'Growing',
    timestamp: '2024-05-21 11:15 AM',
  },
  {
    treeId: 'T1238',
    species: 'Pine',
    walletId: '0.0.567890',
    validator: 'Austin',
    status: 'Diseased',
    timestamp: '2024-05-20 05:00 PM',
  },
];


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Querying...' : 'Check Balance'}
    </Button>
  );
}

export default function BalancePage() {
  const { account, walletType } = useWallet();
  const [state, formAction] = useFormState(handleBalanceInquiry, initialState);
  const [hbarBalances, setHbarBalances] = useState<AllBalances | null>(null);
  const [hbarError, setHbarError] = useState<string | null>(null);
  const [isHbarLoading, setIsHbarLoading] = useState<boolean>(false);

  useEffect(() => {
    if (account && walletType === 'hashpack') {
      const fetchHbarBalance = async () => {
        setIsHbarLoading(true);
        setHbarError(null);
        try {
          const balances = await getAllBalances(account);
          setHbarBalances(balances);
        } catch (error) {
          setHbarError(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
          setIsHbarLoading(false);
        }
      };
      fetchHbarBalance();
    } else {
        setHbarBalances(null);
        setHbarError(null);
    }
  }, [account, walletType]);

  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Balance & Database"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <ArrowUpCircle />
              Send
            </Button>
            <Button variant="outline">
              <ArrowDownCircle />
              Receive
            </Button>
          </div>
        }
      />
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Account Balance Inquiry</CardTitle>
            <CardDescription>Enter an account ID to retrieve its JANI token balance, or connect your wallet to see your own balance.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountId">Account ID</Label>
                <Input id="accountId" name="accountId" placeholder="e.g., 0.0.123456" required defaultValue={account || ''} />
              </div>
              <SubmitButton />
              {state.error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="flex flex-col p-6 text-center bg-card justify-center">
            <div className='flex-grow space-y-4'>
                <div className="flex flex-col items-center">
                  <CircleDollarSign className="w-12 h-12 text-primary mb-2" />
                  <CardTitle className="font-headline text-2xl mb-1">JANI Balance</CardTitle>
                  {state.data ? (
                    <div>
                      <p className="text-4xl font-bold text-primary">
                        {state.data.tokenBalance.toLocaleString()} JANI
                      </p>
                      <p className="text-muted-foreground text-sm break-all">
                        For: {state.data.accountId}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {account ? 'Click "Check Balance" to see your JANI tokens.' : 'Connect wallet to see your balance.'}
                    </p>
                  )}
                </div>
                {walletType === 'hashpack' && (
                    <div className="border-t pt-4 flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary mb-2"><path d="M12 22V12h10V2zM4 12H2v10h10v-2z"></path></svg>
                         <CardTitle className="font-headline text-2xl mb-1">Hedera Balances</CardTitle>
                        {isHbarLoading && <p className="text-muted-foreground text-sm">Loading balances...</p>}
                        {hbarError && <p className="text-red-500 text-sm">{hbarError}</p>}
                        {hbarBalances && (
                             <div>
                                <p className="text-3xl font-bold text-primary">{hbarBalances.hbar} HBAR</p>
                                {hbarBalances.tokens && hbarBalances.tokens.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Token Balances</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Token ID</TableHead>
                                          <TableHead className='text-right'>Balance</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {hbarBalances.tokens.map(token => (
                                          <TableRow key={token.tokenId}>
                                            <TableCell className="font-mono text-xs">{token.tokenId}</TableCell>
                                            <TableCell className='text-right font-medium'>{token.balance.toLocaleString()}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}
                             </div>
                        )}
                   </div>
                )}
            </div>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Verified Conservation Data</CardTitle>
          <CardDescription>
            This table contains the immutable records of all verified conservation efforts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tree ID</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Planted By (Wallet)</TableHead>
                <TableHead>Validator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databaseEntries.map((entry) => (
                <TableRow key={entry.treeId}>
                  <TableCell className="font-medium">{entry.treeId}</TableCell>
                  <TableCell>{entry.species}</TableCell>
                  <TableCell className="font-mono text-sm">{entry.walletId}</TableCell>
                  <TableCell>{entry.validator}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entry.status === 'Growing'
                          ? 'default'
                          : entry.status === 'Needs Attention'
                          ? 'secondary'
                          : 'destructive'
                      }
                       className={
                          entry.status === 'Growing'
                            ? 'bg-primary/20 text-primary-dark hover:bg-primary/30 border border-primary/50'
                            : entry.status === 'Needs Attention'
                            ? 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 border border-yellow-500/50'
                            : 'bg-destructive/20 text-destructive-dark hover:bg-destructive/30 border border-destructive/50'
                        }
                    >
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
