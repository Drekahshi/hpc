
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Droplets, PlusCircle, Repeat } from 'lucide-react';

const liquidityPools = [
  {
    id: 'pool_001',
    name: 'UMOT / UMOS',
    tvl: 1250000,
    volume24h: 78000,
    apr: 24.5,
  },
  {
    id: 'pool_002',
    name: 'UMOT / HBAR',
    tvl: 850000,
    volume24h: 45000,
    apr: 18.2,
  },
  {
    id: 'pool_003',
    name: 'UMOS / USDC',
    tvl: 2500000,
    volume24h: 150000,
    apr: 8.5,
  },
    {
    id: 'pool_004',
    name: 'JANI / UMOS',
    tvl: 550000,
    volume24h: 22000,
    apr: 32.1,
  },
];

export function SwapPools() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Droplets /> HISA SAUCE Swap Pools
        </CardTitle>
        <CardDescription>
          Provide liquidity to earn rewards and swap tokens seamlessly across the Hisa ecosystem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pool</TableHead>
              <TableHead className="hidden sm:table-cell">TVL</TableHead>
              <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
              <TableHead>APR</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liquidityPools.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell className="font-medium">{pool.name}</TableCell>
                <TableCell className="hidden sm:table-cell">${pool.tvl.toLocaleString()}</TableCell>
                <TableCell className="hidden md:table-cell">${pool.volume24h.toLocaleString()}</TableCell>
                <TableCell className="text-green-600 font-medium">
                  {pool.apr.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <PlusCircle />
                      <span className="hidden sm:inline-block">Add</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Repeat />
                       <span className="hidden sm:inline-block">Swap</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button>Create New Pool</Button>
      </CardFooter>
    </Card>
  );
}
