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

interface BadgeItemProps {
  name: string;
  badgeClass?: string;
  animated: boolean;
  baseClasses: string;
}

function BadgeItem({ name, badgeClass, animated, baseClasses }: BadgeItemProps) {
  const className = cn(
    baseClasses,
    badgeClass || "bg-muted text-muted-foreground border-border",
  );

  if (animated) {
    return (
      <motion.span whileHover={{ scale: 1.05 }} className={cn(className, "hover:border-primary/30")}>
        {name}
      </motion.span>
    );
  }

  return <span className={className}>{name}</span>;
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
        <BadgeItem
          name={projectInfo.name}
          badgeClass={projectInfo.colorClasses?.badge}
          animated={animated}
          baseClasses={baseClasses}
        />
      ) : null}
      {categoryId && categoryInfo.name ? (
        <BadgeItem
          name={categoryInfo.name}
          badgeClass={categoryInfo.colorClasses?.badge}
          animated={animated}
          baseClasses={baseClasses}
        />
      ) : null}
    </>
  );
});
