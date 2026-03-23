import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { AppHeader } from '@/components/app-header';
import { Users, Landmark, ShieldCheck, PlusCircle, Leaf, BarChart, Sun, Wind, CloudRain, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ConservationChart } from '@/components/conservation-chart';
import { RecentActivity } from '@/components/recent-activity';

const keyMetrics = [
    {
        metric: 'Total Trees Planted',
        value: '10,482',
        icon: Leaf,
        change: '+5.2% this month'
    },
    {
        metric: 'Carbon Offset (Est.)',
        value: '42.8 tons CO₂e',
        icon: BarChart,
        change: 'Based on DOVU MRV'
    },
    {
        metric: 'Active Validators',
        value: '24',
        icon: Users,
        change: '+2 new validators'
    },
    {
        metric: 'Projects Funded',
        value: '7',
        icon: Landmark,
        change: 'Across 3 CFAs'
    },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Jani Hisa Dashboard"
        description="Monitor and verify decentralized conservation efforts."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map(metric => (
            <Card key={metric.metric} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.metric}
                </CardTitle>
                <metric.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.change}</p>
              </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <ConservationChart />
        </div>
        <div className="lg:col-span-1">
            <RecentActivity />
        </div>
      </div>

       <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Join the Movement</CardTitle>
                <CardDescription>
                Your actions create a ripple effect of positive change. Get involved today.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <Link href="/plant">
                  <Card className="group flex flex-col items-center justify-center p-6 text-center h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                      <PlusCircle className="w-12 h-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                      <CardTitle className="font-headline text-lg">Plant a New Tree</CardTitle>
                      <CardDescription className="text-sm">Register a seedling and start its journey in the JANI ecosystem.</CardDescription>
                  </Card>
                </Link>
                <Link href="/validate">
                  <Card className="group flex flex-col items-center justify-center p-6 text-center h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                      <ShieldCheck className="w-12 h-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                      <CardTitle className="font-headline text-lg">Become a Validator</CardTitle>
                      <CardDescription className="text-sm">Verify conservation efforts and earn JANI tokens for your work.</CardDescription>
                  </Card>
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}
