import { Skeleton } from "@/shared/ui/skeleton";

// Server Component - Skeleton for Sleep Page
export function SleepPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Dashboard Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sleep Timer Card */}
        <Skeleton className="h-48 w-full rounded-xl" />

        {/* Stats Cards */}
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />

        {/* Wind Down Card */}
        <Skeleton className="h-64 w-full rounded-xl md:col-span-2" />

        {/* Config Card */}
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
