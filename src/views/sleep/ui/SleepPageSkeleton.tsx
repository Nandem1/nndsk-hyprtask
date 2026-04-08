"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * SleepPageSkeleton
 *
 * Animated skeleton loading state for the Sleep Dashboard.
 * Matches the layout of SleepDashboard with staggered entry animations.
 */
export function SleepPageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2 animate-pulse" />
        <Skeleton className="h-5 w-64 animate-pulse" />
      </div>

      {/* Dashboard Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sleep Timer Card */}
        <Skeleton className="h-48 w-full rounded-xl animate-pulse" />

        {/* Stats Cards */}
        <Skeleton className="h-48 w-full rounded-xl animate-pulse" />
        <Skeleton className="h-48 w-full rounded-xl animate-pulse" />

        {/* Wind Down Card */}
        <Skeleton className="h-64 w-full rounded-xl md:col-span-2 animate-pulse" />

        {/* Config Card */}
        <Skeleton className="h-64 w-full rounded-xl animate-pulse" />
      </div>
    </motion.div>
  );
}
