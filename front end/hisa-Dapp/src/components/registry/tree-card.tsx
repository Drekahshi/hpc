'use client';

import type { Tree } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

type TreeCardProps = {
  tree: Tree;
  onClick: () => void;
};

export function TreeCard({ tree, onClick }: TreeCardProps) {
  const statusColors: { [key: string]: string } = {
    growing: 'bg-green-100 text-green-800 border-green-200',
    mature: 'bg-blue-100 text-blue-800 border-blue-200',
    dead: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    disputed: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  const validationStatusColors: { [key: string]: string } = {
    verified: 'text-green-600',
    pending: 'text-yellow-600',
    disputed: 'text-orange-600',
    dead: 'text-red-600',
  };

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-lg border shadow-sm hover:shadow-lg transition-shadow cursor-pointer p-4"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-headline text-lg">{tree.species.commonName}</h3>
        <Badge
          variant="outline"
          className={`px-2 py-1 rounded text-xs font-medium ${
            statusColors[tree.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {tree.status}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-2 italic">
        {tree.species.scientificName}
      </p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Planted:</span>
          <span className="font-medium">
            {tree.planting.date
              ? new Date(tree.planting.date.seconds * 1000).toLocaleDateString()
              : 'N/A'}
          </span>
        </div>

        {tree.growth && tree.growth.length > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Height:</span>
            <span className="font-medium">
              {tree.growth[tree.growth.length - 1].height} cm
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Validation:</span>
          <span
            className={`font-medium ${
              validationStatusColors[tree.validation.status] || 'text-muted-foreground'
            }`}
          >
            {tree.validation.status}
          </span>
        </div>
      </div>
    </div>
  );
}
