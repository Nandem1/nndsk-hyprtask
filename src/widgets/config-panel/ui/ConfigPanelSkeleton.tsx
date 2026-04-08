
"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * ConfigPanelSkeleton
 *
 * Animated skeleton loading state for the Config Panel.
 * Matches the layout of ConfigPanel with staggered entry animations.
 */
export function ConfigPanelSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Config Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>

      {/* Theme Palette Selector */}
      <div className="mb-6">
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>

      {/* Emote Manager */}
      <div>
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </motion.div>
  );
}
