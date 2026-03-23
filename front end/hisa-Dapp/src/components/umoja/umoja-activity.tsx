
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building, Droplets, User, Repeat } from 'lucide-react';
import Image from 'next/image';

const activities = [
  {
    id: 1,
    type: 'investment',
    user: {
      name: '0x...a4b2',
      avatar: 'https://picsum.photos/seed/trader1/40/40',
      avatarHint: 'abstract art'
    },
    details: 'Invested 50,000 UMOS in Green-Tech Innovations.',
    target: {
        name: 'Green-Tech',
        icon: Building,
    },
    timestamp: '15 minutes ago',
  },
  {
    id: 2,
    type: 'liquidity',
    user: {
      name: '0x...f8e1',
      avatar: 'https://picsum.photos/seed/trader2/40/40',
      avatarHint: 'futuristic city'
    },
    details: 'Added 1,000,000 UMOT and 500,000 UMOS to the liquidity pool.',
    target: {
        name: 'UMOT/UMOS Pool',
        icon: Droplets,
    },
    timestamp: '1 hour ago',
  },
  {
    id: 3,
    type: 'swap',
    user: {
      name: '0x...c9d3',
      avatar: 'https://picsum.photos/seed/trader3/40/40',
      avatarHint: 'glowing orb'
    },
    details: 'Swapped 25,000 HBAR for UMOT.',
     target: {
        name: 'HBAR/UMOT Swap',
        icon: Repeat,
    },
    timestamp: '3 hours ago',
  },
    {
    id: 4,
    type: 'listing',
    user: {
      name: 'Agri-Connect',
      avatar: 'https://picsum.photos/seed/sme1/40/40',
      avatarHint: 'wheat field'
    },
    details: 'Agri-Connect Solutions has been listed on the UCSE marketplace.',
     target: {
        name: 'New Listing',
        icon: Building
    },
    timestamp: '8 hours ago',
  },
];

export function UmojaActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Recent Activity</CardTitle>
        <CardDescription>Live feed of ecosystem transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} data-ai-hint={activity.user.avatarHint} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="text-sm">
                    <span className="font-semibold">{activity.user.name}</span> {activity.details}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className='w-16 h-10 rounded-md bg-muted flex items-center justify-center'>
                        <activity.target.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                        <Badge variant={activity.type === 'investment' ? 'default' : 'secondary'} className='text-xs capitalize'>
                            {activity.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
