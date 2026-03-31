import { Skeleton } from "@/shared/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-between px-4">
        <Skeleton className="h-5 w-24" />

        <div className="flex-1 flex justify-center px-8">
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex items-center gap-1">
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
        </div>
      </div>
    </header>
  );
}
