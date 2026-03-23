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
import { Leaf, User } from 'lucide-react';
import Image from 'next/image';

const activities = [
  {
    id: 1,
    type: 'planting',
    user: {
      name: 'A. Mwangi',
      avatar: 'https://picsum.photos/seed/user1/40/40',
      avatarHint: 'profile photo'
    },
    details: 'Planted an Acacia tree near Ololua Forest.',
    tree: {
        species: 'Acacia',
        image: 'https://picsum.photos/seed/acacia1/200/150',
        imageHint: 'acacia tree'
    },
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'validation',
    user: {
      name: 'C. Wanjiru',
      avatar: 'https://picsum.photos/seed/user2/40/40',
      avatarHint: 'profile portrait'
    },
    details: 'Validated a 6-month old Oak tree.',
    tree: {
        species: 'Oak Tree',
        image: 'https://picsum.photos/seed/oak1/200/150',
        imageHint: 'oak tree'
    },
    timestamp: '5 hours ago',
  },
  {
    id: 3,
    type: 'planting',
    user: {
      name: 'M. Ochieng',
      avatar: 'https://picsum.photos/seed/user3/40/40',
      avatarHint: 'person smiling'
    },
    details: 'Registered a new Medicinal plant in Karura.',
    tree: {
        species: 'Medicinal Plant',
        image: 'https://picsum.photos/seed/medicinal1/200/150',
        imageHint: 'medicinal plant'
    },
    timestamp: '1 day ago',
  },
    {
    id: 4,
    type: 'validation',
    user: {
      name: 'S. Kimani',
      avatar: 'https://picsum.photos/seed/user4/40/40',
      avatarHint: 'woman face'
    },
    details: 'Confirmed the health of a Bamboo grove.',
     tree: {
        species: 'Bamboo',
        image: 'https://picsum.photos/seed/bamboo1/200/150',
        imageHint: 'bamboo forest'
    },
    timestamp: '2 days ago',
  },
];

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Recent Activity</CardTitle>
        <CardDescription>Live feed of conservation efforts.</CardDescription>
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
                    <div className='w-24 h-16 rounded-md overflow-hidden'>
                        <Image src={activity.tree.image} alt={activity.tree.species} width={96} height={64} className="object-cover w-full h-full" data-ai-hint={activity.tree.imageHint} />
                    </div>
                    <div>
                        <Badge variant={activity.type === 'planting' ? 'default' : 'secondary'} className='text-xs'>
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
