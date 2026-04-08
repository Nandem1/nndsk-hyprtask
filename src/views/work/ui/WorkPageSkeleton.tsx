"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/shared/ui/skeleton";

// Motion-enabled skeleton items for consistent entry animation
function SkeletonItem({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Skeleton className={className} />
    </motion.div>
  );
}

// Server Component - Skeleton for Work Page
export function WorkPageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto px-4 py-8 max-w-2xl"
    >
      {/* Header Skeleton */}
      <div className="mb-8">
        <SkeletonItem delay={0} className="h-10 w-48 mb-2" />
        <SkeletonItem delay={0.05} className="h-5 w-64" />
      </div>

      {/* Work Timer Card */}
      <SkeletonItem delay={0.1} className="h-48 w-full rounded-xl mb-6" />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <SkeletonItem delay={0.15} className="h-32 w-full rounded-xl" />
        <SkeletonItem delay={0.2} className="h-32 w-full rounded-xl" />
      </div>

      {/* Break Duration Card */}
      <SkeletonItem delay={0.25} className="h-32 w-full rounded-xl mb-6" />

      {/* Config Link */}
      <SkeletonItem delay={0.3} className="h-10 w-full rounded-xl" />
    </motion.div>
  );
}
