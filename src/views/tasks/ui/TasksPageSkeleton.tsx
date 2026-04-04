import { Skeleton } from "@/shared/ui/skeleton";
import { Separator } from "@/shared/ui/separator";

export function TasksPageSkeleton() {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] relative">
      <div className="hidden md:block w-64 p-4 border-r border-border/20">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Separator className="my-4 bg-border/20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="size-10 md:hidden" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-40" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
