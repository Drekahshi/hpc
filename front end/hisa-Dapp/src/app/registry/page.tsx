'use client';

import { AppHeader } from '@/components/app-header';
import { TreeRegistry } from '@/components/registry/tree-registry';

export default function RegistryPage() {
  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Tree Registry"
        description="Browse and manage all trees in your Community Forest Association."
      />
      <TreeRegistry />
    </div>
  );
}
