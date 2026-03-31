// Server Component - Skeleton for Header
export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo Skeleton */}
        <div className="h-5 w-24 bg-muted rounded animate-pulse" />

        {/* Center Skeleton */}
        <div className="flex-1 flex justify-center px-8">
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center gap-1">
          <div className="h-9 w-9 bg-muted rounded animate-pulse" />
          <div className="h-9 w-9 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </header>
  );
}
