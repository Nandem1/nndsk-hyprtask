// Server Component - Skeleton for Header
export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo Skeleton */}
        <div className="h-7 w-24 bg-muted rounded animate-pulse" />

        {/* Actions Skeleton */}
        <div className="flex items-center gap-4">
          {/* Current Task Skeleton */}
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <div className="w-3.5 h-3.5 rounded bg-muted animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Sleep Timer Skeleton */}
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <div className="w-3.5 h-3.5 rounded bg-muted animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-10 bg-muted rounded animate-pulse" />
              <div className="h-4 w-14 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Config Button Skeleton */}
          <div className="h-9 w-24 bg-muted rounded animate-pulse" />

          {/* Theme Toggle Skeleton */}
          <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  );
}
