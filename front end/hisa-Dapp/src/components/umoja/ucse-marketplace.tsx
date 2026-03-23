
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Building,
  BrainCircuit,
  BarChart,
  FileText,
} from 'lucide-react';

const smes = [
  {
    id: 'SME_001',
    name: 'Green-Tech Innovations',
    sector: 'Renewable Energy',
    creditScore: 820,
    marketOpportunity: 8.5,
    tokenizationReadiness: 95,
    fundingGoal: 500000,
    raised: 250000,
    investors: 42,
  },
  {
    id: 'SME_002',
    name: 'Agri-Connect Solutions',
    sector: 'Agriculture',
    creditScore: 780,
    marketOpportunity: 9.2,
    tokenizationReadiness: 88,
    fundingGoal: 300000,
    raised: 300000,
    investors: 89,
  },
];

export function UcseMarketplace() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Building /> UCSE Marketplace
        </CardTitle>
        <CardDescription>
          Invest in tokenized Kenyan SMEs on the HSUITE-powered exchange.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        {smes.map((sme) => (
          <Card
            key={sme.id}
            className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <CardHeader>
              <CardTitle className="font-headline text-base">
                {sme.name}
              </CardTitle>
              <CardDescription className="text-xs">{sme.sector}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-primary">
                    Raised: ${sme.raised.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    Goal: ${sme.fundingGoal.toLocaleString()}
                  </span>
                </div>
                <Progress value={(sme.raised / sme.fundingGoal) * 100} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-1.5 rounded-md bg-muted">
                  <p className="font-bold flex items-center justify-center gap-1">
                    <FileText className="h-3 w-3" />
                    {sme.creditScore}
                  </p>
                  <p className="text-muted-foreground text-[10px]">
                    Credit Score
                  </p>
                </div>
                <div className="p-1.5 rounded-md bg-muted">
                  <p className="font-bold flex items-center justify-center gap-1">
                    <BarChart className="h-3 w-3" />
                    {sme.marketOpportunity}/10
                  </p>
                  <p className="text-muted-foreground text-[10px]">Market</p>
                </div>
                <div className="p-1.5 rounded-md bg-muted">
                  <p className="font-bold flex items-center justify-center gap-1">
                    <BrainCircuit className="h-3 w-3" />
                    {sme.tokenizationReadiness}%
                  </p>
                  <p className="text-muted-foreground text-[10px]">Readiness</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 !pt-0">
              <Button variant="outline" size="sm" className="w-full">
                Details
              </Button>
              <Button size="sm" className="w-full">
                Invest
              </Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="secondary" className="w-full">
          Browse All SMEs
        </Button>
      </CardFooter>
    </Card>
  );
}
