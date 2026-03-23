'use client';
import type { Tree } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

type TreeMapProps = {
  trees: Tree[];
  onTreeSelect: (tree: Tree) => void;
};

// This is a placeholder for a map component.
// A real implementation would use a library like Leaflet or Google Maps.
export function TreeMap({ trees, onTreeSelect }: TreeMapProps) {
  return (
    <Card className="h-full w-full min-h-[400px]">
      <CardContent className="p-0 h-full w-full relative">
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Map view placeholder</p>
        </div>
        {trees.map((tree, index) => (
          <div
            key={tree.id}
            className="absolute w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 transition-transform"
            style={{
              // These are random positions for demonstration
              left: `${(index * 13 + 10) % 80 + 10}%`,
              top: `${(index * 23 + 20) % 80 + 10}%`,
            }}
            onClick={() => onTreeSelect(tree)}
            title={tree.species.commonName}
          />
        ))}
      </CardContent>
    </Card>
  );
}
