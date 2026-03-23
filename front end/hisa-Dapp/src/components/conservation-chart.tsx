'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { month: 'Jan', indigenous: 186, exotic: 80, medicinal: 40 },
  { month: 'Feb', indigenous: 305, exotic: 200, medicinal: 60 },
  { month: 'Mar', indigenous: 237, exotic: 120, medicinal: 90 },
  { month: 'Apr', indigenous: 273, exotic: 190, medicinal: 110 },
  { month: 'May', indigenous: 209, exotic: 130, medicinal: 70 },
  { month: 'Jun', indigenous: 214, exotic: 140, medicinal: 50 },
];

const chartConfig = {
  indigenous: {
    label: 'Indigenous',
    color: 'hsl(var(--chart-1))',
  },
  exotic: {
    label: 'Exotic',
    color: 'hsl(var(--chart-2))',
  },
  medicinal: {
    label: 'Medicinal',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

export function ConservationChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Monthly Planting Report</CardTitle>
        <CardDescription>Trees planted by type over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="indigenous" stackId="a" fill="var(--color-indigenous)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="exotic" stackId="a" fill="var(--color-exotic)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="medicinal" stackId="a" fill="var(--color-medicinal)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
