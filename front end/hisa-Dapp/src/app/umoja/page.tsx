
import { AppHeader } from '@/components/app-header';
import { UmojaStats } from '@/components/umoja/umoja-stats';
import { SwapPools } from '@/components/umoja/swap-pools';
import { UcseMarketplace } from '@/components/umoja/ucse-marketplace';
import { UmojaChart } from '@/components/umoja/umoja-chart';
import Link from 'next/link';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Droplets, Repeat, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UmojaActivity } from '@/components/umoja/umoja-activity';

export default function UmojaPage() {
  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Umoja Hisa Dashboard"
        description="Track financial metrics and ecosystem growth in real-time."
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

      <UmojaStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <UmojaChart />
        </div>
        <div className="lg:col-span-1">
            <UmojaActivity />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <SwapPools />
        </div>
        <div className="lg:col-span-1">
            <UcseMarketplace />
        </div>
      </div>


       <div>
        <h2 className="text-xl font-bold font-headline tracking-tight text-foreground mb-4">
            Ecosystem Actions
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
            <Link href="/umoja">
              <Card className="group flex flex-col items-center justify-center p-6 text-center h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <Building className="w-12 h-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                  <CardTitle className="font-headline text-lg">Register your SME</CardTitle>
                  <CardDescription className="text-sm">Tokenize your enterprise on the UCSE marketplace.</CardDescription>
              </Card>
            </Link>
             <Link href="/umoja">
              <Card className="group flex flex-col items-center justify-center p-6 text-center h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <Droplets className="w-12 h-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                  <CardTitle className="font-headline text-lg">Explore Swap Pools</CardTitle>
                  <CardDescription className="text-sm">Provide liquidity and earn rewards on HISA SAUCE.</CardDescription>
              </Card>
            </Link>
            <Link href="/umoja">
              <Card className="group flex flex-col items-center justify-center p-6 text-center h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <Repeat className="w-12 h-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                  <CardTitle className="font-headline text-lg">Trade on UCSE</CardTitle>
                  <CardDescription className="text-sm">Invest in tokenized small and medium-sized enterprises.</CardDescription>
              </Card>
            </Link>
        </div>
      </div>
    </div>
  );
}
