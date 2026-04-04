"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { transitions } from "@/shared/lib/animations";
import { AlertCircle, LayoutList, GitBranch } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import type { ExtendedThemeClasses } from "@/shared/types/theme";

const VIEW_MODES = [
  { id: "pipeline" as const, label: "Pipeline", icon: GitBranch },
  { id: "kanban" as const, label: "Kanban", icon: LayoutList },
];

interface TaskBoardHeaderProps {
  filteredCount: number;
  totalCount: number;
  viewMode: "pipeline" | "kanban";
  isTransitioning: boolean;
  onViewModeChange: (mode: "pipeline" | "kanban") => void;
  canAddTask: boolean;
  remainingSlots: number;
  themeClasses: ExtendedThemeClasses;
}

export function TaskBoardHeader({
  filteredCount,
  totalCount,
  viewMode,
  isTransitioning,
  onViewModeChange,
  canAddTask,
  remainingSlots,
  themeClasses,
}: TaskBoardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-baseline gap-2">
        <motion.span
          className={cn("text-3xl font-bold", themeClasses.textPrimary)}
          key={filteredCount}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={transitions.spring}
        >
          {filteredCount}
        </motion.span>
        {filteredCount !== totalCount && (
          <span className="text-sm text-muted-foreground">/ {totalCount}</span>
        )}
        <span className="text-sm text-muted-foreground ml-2">
          {filteredCount === 1 ? "nota" : "notas"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => {
            if (value) onViewModeChange(value as "pipeline" | "kanban");
          }}
          disabled={isTransitioning}
          className="bg-muted p-1 rounded-lg"
        >
          {VIEW_MODES.map((mode) => (
            <ToggleGroupItem
              key={mode.id}
              value={mode.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:text-foreground transition-colors duration-200"
            >
              <mode.icon className="size-4" />
              <span className="hidden sm:inline">{mode.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {!canAddTask && (
          <Badge
            variant="outline"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10"
          >
            <AlertCircle className="size-3.5" />
            <span className="text-xs font-medium">Limite</span>
          </Badge>
        )}
        {canAddTask && remainingSlots <= 2 && (
          <motion.div
            className="px-3 py-1.5 rounded-lg border border-border bg-muted text-muted-foreground"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={transitions.spring}
          >
            <span className="text-xs font-medium">{remainingSlots} restantes</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
