'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { TreeMap } from './tree-map';
import { TreeDetails } from './tree-details';
import { TreeCard } from './tree-card';
import type { Tree } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TreeRegistry() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    species: 'all',
  });

  const treesQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    // NOTE: This query requires a composite index in Firestore.
    // The error message in the console will provide a link to create it.
    return query(
      collection(db, 'trees'),
      // where('planting.cfaId', '==', user.cfaId) // This requires cfaId on user document
      orderBy('planting.date', 'desc')
    );
  }, [firestore, user?.uid]);

  const { data: trees, isLoading: isLoadingTrees } = useCollection<Tree>(treesQuery);

  const filteredTrees = useMemo(() => {
    if (!trees) return [];
    let filtered = trees;

    if (filters.status !== 'all') {
      filtered = filtered.filter(tree => tree.status === filters.status);
    }

    if (filters.species !== 'all') {
      filtered = filtered.filter(tree => tree.species.commonName === filters.species);
    }

    return filtered;
  }, [filters, trees]);
  
  const uniqueSpecies = useMemo(() => {
    if (!trees) return [];
    return [...new Set(trees.map(t => t.species.commonName))];
  }, [trees]);
  
  const isLoading = isUserLoading || isLoadingTrees;

  if (isLoading) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Skeleton className="h-[500px] w-full" />
            </div>
            <div className="space-y-4">
                 <Skeleton className="h-[200px] w-full" />
                 <Skeleton className="h-[300px] w-full" />
            </div>
        </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline text-foreground">Tree Registry</h1>
        <div className="flex gap-4">
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="growing">Growing</SelectItem>
                    <SelectItem value="mature">Mature</SelectItem>
                    <SelectItem value="dead">Dead</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.species} onValueChange={(value) => setFilters(prev => ({...prev, species: value}))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by species" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Species</SelectItem>
                    {uniqueSpecies.map(species => (
                        <SelectItem key={species} value={species}>{species}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TreeMap 
            trees={filteredTrees || []} 
            onTreeSelect={setSelectedTree}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Trees</span>
                <span className="font-bold text-foreground">{trees?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Growing</span>
                <span className="font-bold text-green-600">
                  {trees?.filter(t => t.status === 'growing').length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mature</span>
                <span className="font-bold text-blue-600">
                  {trees?.filter(t => t.status === 'mature').length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CO₂ Offset</span>
                <span className="font-bold text-purple-600">
                  {(trees?.reduce((sum, t) => sum + (t.iotData?.co2Absorption || 0), 0) || 0).toFixed(1)} kg
                </span>
              </div>
            </CardContent>
          </Card>

          {selectedTree && (
            <TreeDetails 
              tree={selectedTree} 
              onClose={() => setSelectedTree(null)}
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold font-headline mb-4">All Trees ({filteredTrees.length})</h2>
        {filteredTrees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTrees.map(tree => (
                <TreeCard 
                    key={tree.id} 
                    tree={tree} 
                    onClick={() => setSelectedTree(tree)}
                />
                ))}
            </div>
        ) : (
            <p className="text-muted-foreground">No trees match the current filters.</p>
        )}
      </div>
    </div>
  );
}
