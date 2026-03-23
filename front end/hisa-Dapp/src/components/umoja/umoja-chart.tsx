
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { month: 'January', tvl: 18.6 },
  { month: 'February', tvl: 22.5 },
  { month: 'March', tvl: 29.7 },
  { month: 'April', tvl: 27.3 },
  { month: 'May', tvl: 35.9 },
  { month: 'June', tvl: 42.8 },
];

const chartConfig = {
  tvl: {
    label: 'Total Value Locked (M)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function UmojaChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Ecosystem TVL Growth</CardTitle>
        <CardDescription>
          Total Value Locked (in millions USD) over the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
                tickFormatter={(value) => `$${value}M`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillTvl" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tvl)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tvl)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area 
                dataKey="tvl" 
                type="natural"
                fill="url(#fillTvl)"
                stroke="var(--color-tvl)"
                strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
