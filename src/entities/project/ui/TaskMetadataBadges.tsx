"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import {
  useProjectInfo,
  useCategoryInfo,
} from "../hooks/use-project-colors";

interface TaskMetadataBadgesProps {
  projectId?: string;
  categoryId?: string;
  animated?: boolean;
}

export const TaskMetadataBadges = memo(function TaskMetadataBadges({
  projectId,
  categoryId,
  animated = false,
}: TaskMetadataBadgesProps) {
  const projectInfo = useProjectInfo(projectId);
  const categoryInfo = useCategoryInfo(categoryId);

  const baseClasses =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition-colors";

  return (
    <>
      {projectId && projectInfo.name ? (
        animated ? (
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={cn(
              baseClasses,
              projectInfo.colorClasses?.badge ||
                "bg-muted text-muted-foreground border-border hover:border-primary/30",
            )}
          >
            {projectInfo.name}
          </motion.span>
        ) : (
          <span
            className={cn(
              baseClasses,
              projectInfo.colorClasses?.badge ||
                "bg-muted text-muted-foreground border-border",
            )}
          >
            {projectInfo.name}
          </span>
        )
      ) : null}
      {categoryId && categoryInfo.name ? (
        animated ? (
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={cn(
              baseClasses,
              categoryInfo.colorClasses?.badge ||
                "bg-muted text-muted-foreground border-border hover:border-primary/30",
            )}
          >
            {categoryInfo.name}
          </motion.span>
        ) : (
          <span
            className={cn(
              baseClasses,
              categoryInfo.colorClasses?.badge ||
                "bg-muted text-muted-foreground border-border",
            )}
          >
            {categoryInfo.name}
          </span>
        )
      ) : null}
    </>
  );
});
