// components/ui/Skeleton.tsx
import { cn } from '@/lib/utils/helpers';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'avatar' | 'card' | 'button';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const base = 'shimmer rounded-lg bg-navy-100 dark:bg-navy-700';
  const variants = {
    text:   'h-4',
    avatar: 'w-10 h-10 rounded-full',
    card:   'h-32',
    button: 'h-10 w-24 rounded-xl',
  };
  return <div className={cn(base, variants[variant], className)} />;
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" className="w-12 h-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="button" className="flex-1 h-9" />
        <Skeleton variant="button" className="h-9 w-20" />
      </div>
    </div>
  );
}

export function JobSkeleton() {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-9 w-28 rounded-xl" />
    </div>
  );
}

export function EventSkeleton() {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden">
      <Skeleton className="h-28 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-9 rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-56" />
      </div>

      {/* Banner skeleton */}
      <Skeleton className="h-24 rounded-2xl" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 space-y-3">
            <div className="flex items-start justify-between">
              <Skeleton className="w-11 h-11 rounded-xl" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-navy-800 rounded-2xl border border-border p-6 space-y-4">
          <Skeleton className="h-5 w-36" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
