import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-lg font-bold font-headline">
        HISA PEOPLES CHAIN
      </span>
    </div>
  );
}
