"use client";

import { memo } from "react";
import { cn } from "@/shared/lib/utils";
import { useProjectInfo } from "../hooks/use-project-colors";

interface ProjectNameProps {
  projectId: string;
  variant?: "text" | "badge";
}

export const ProjectName = memo(function ProjectName({
  projectId,
  variant = "text",
}: ProjectNameProps) {
  const { name, colorClasses } = useProjectInfo(projectId);

  if (variant === "badge") {
    return (
      <span className={cn("text-xs font-medium", colorClasses.text)}>{name}</span>
    );
  }

  return <p className="text-muted-foreground mt-2">{name}</p>;
});
