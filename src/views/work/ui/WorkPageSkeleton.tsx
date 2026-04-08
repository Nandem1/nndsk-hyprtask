import { Skeleton } from "@/shared/ui/skeleton";

// Server Component - Skeleton for Work Page
export function WorkPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Work Timer Card */}
      <Skeleton className="h-48 w-full rounded-xl mb-6" />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>

      {/* Break Duration Card */}
      <Skeleton className="h-32 w-full rounded-xl mb-6" />

      {/* Config Link */}
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}
