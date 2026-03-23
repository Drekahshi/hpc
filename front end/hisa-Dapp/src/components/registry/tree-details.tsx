'use client';

import type { Tree } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Calendar, MapPin, ShieldCheck, Sprout } from 'lucide-react';
import Image from 'next/image';

type TreeDetailsProps = {
  tree: Tree;
  onClose: () => void;
};

export function TreeDetails({ tree, onClose }: TreeDetailsProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">{tree.species.commonName}</CardTitle>
            <CardDescription>{tree.species.scientificName}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="aspect-video bg-muted rounded-md overflow-hidden">
            <Image
                src={`https://picsum.photos/seed/${tree.id}/600/400`}
                alt={tree.species.commonName}
                width={600}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint="healthy tree"
            />
        </div>
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-primary" />
                <span>Status: <span className="font-semibold">{tree.status}</span></span>
            </div>
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Validation: <span className="font-semibold">{tree.validation.status}</span></span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Planted: {new Date(tree.planting.date.seconds * 1000).toLocaleDateString()}</span>
            </div>
             <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Location: {tree.planting.location.lat.toFixed(4)}, {tree.planting.location.lng.toFixed(4)}</span>
            </div>
        </div>

        {tree.growth && tree.growth.length > 0 && (
            <div>
                <h4 className="font-semibold mb-2">Latest Growth Record:</h4>
                <div className="text-muted-foreground space-y-1">
                    <p>Height: {tree.growth[tree.growth.length - 1].height} cm</p>
                    <p>Health Score: {tree.growth[tree.growth.length - 1].healthScore}/10</p>
                </div>
            </div>
        )}
        
      </CardContent>
    </Card>
  );
}
