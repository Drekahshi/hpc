
'use client';

import { AppHeader } from '@/components/app-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, PlusCircle } from 'lucide-react';
import Image from 'next/image';

const pools = [
  {
    id: 1,
    name: 'OLOOLUA FOREST YOUTH POOL',
    description: 'Help restore vital parts of the Ololua forest by funding the plantation of native tree species.',
    imageUrl: 'https://picsum.photos/seed/amazon/600/400',
    imageHint: 'rainforest',
    goal: 50000,
    raised: 35200,
    contributors: 478,
  },
  {
    id: 2,
    name: 'KENYA AIRWAYS GREEN POOL',
    description: 'Join kenya airways in carbon emmision reduction',
    imageUrl: 'https://picsum.photos/seed/reef/600/400',
    imageHint: 'coral reef',
    goal: 75000,
    raised: 21500,
    contributors: 231,
  },
  {
    id: 3,
    name: 'KARURA POOL',
    description: 'Contribute to the preservation of KARURA Forest',
    imageUrl: 'https://picsum.photos/seed/amazon-forest/600/400',
    imageHint: 'amazon forest',
    goal: 100000,
    raised: 89000,
    contributors: 1042,
  },
  {
    id: 4,
    name: 'MAASAI MARA CONSERVATION',
    description: 'Protect wildlife corridors and reduce human-wildlife conflict in the Maasai Mara ecosystem.',
    imageUrl: 'https://picsum.photos/seed/wildebeest-migration/600/400',
    imageHint: 'wildebeest migration',
    goal: 120000,
    raised: 45000,
    contributors: 600,
  },
  {
    id: 5,
    name: 'MT. KENYA WATER TOWERS',
    description: 'Secure water resources for millions by reforesting the critical Mt. Kenya water catchment area.',
    imageUrl: 'https://picsum.photos/seed/mountain/600/400',
    imageHint: 'mountain forest',
    goal: 80000,
    raised: 62000,
    contributors: 750,
  },
  {
    id: 6,
    name: 'COASTAL MANGROVE PROJECT',
    description: 'Restore mangrove forests along the Kenyan coast to protect shorelines and sequester carbon.',
    imageUrl: 'https://picsum.photos/seed/mangrove/600/400',
    imageHint: 'mangrove forest',
    goal: 60000,
    raised: 30000,
    contributors: 320,
  },
  {
    id: 7,
    name: 'NAIROBI NATIONAL PARK GREEN BELT',
    description: 'Create a green buffer zone around Nairobi National Park to protect urban wildlife.',
    imageUrl: 'https://picsum.photos/seed/city-park/600/400',
    imageHint: 'city park',
    goal: 95000,
    raised: 55000,
    contributors: 810,
  },
];

export default function PoolsPage() {
  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Conservation Pools"
        description="Contribute to global conservation projects and earn rewards."
      />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pools.map((pool) => (
          <Card key={pool.id} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="p-0">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={pool.imageUrl}
                  alt={pool.name}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                  data-ai-hint={pool.imageHint}
                />
              </div>
               <div className="p-6">
                 <CardTitle className="font-headline text-xl">{pool.name}</CardTitle>
                <CardDescription className="mt-2 h-12">{pool.description}</CardDescription>
               </div>
            </CardHeader>
            <CardContent className="flex-grow p-6 pt-0">
                <div className='space-y-4'>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-primary">
                                {pool.raised.toLocaleString()} JANI
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {pool.goal.toLocaleString()} JANI
                            </span>
                        </div>
                        <Progress value={(pool.raised / pool.goal) * 100} />
                    </div>
                    <p className="text-sm text-muted-foreground">{pool.contributors.toLocaleString()} contributors</p>
                </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex gap-2">
              <Button className="w-full">
                <Droplets className="mr-2 h-4 w-4" />
                Contribute
              </Button>
               <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Join Pool
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
