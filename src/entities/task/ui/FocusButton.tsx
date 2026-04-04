"use client";

import { cn } from "@/shared/lib/utils";
import { Zap } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { ExtendedThemeClasses } from "@/shared/types/theme";

interface FocusButtonProps {
  onClick: (e: React.MouseEvent) => void;
  classes: ExtendedThemeClasses;
  showLabel?: boolean;
  className?: string;
}

export function FocusButton({
  onClick,
  classes,
  showLabel = true,
  className,
}: FocusButtonProps) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      className={cn(
        "gap-1.5 h-9 transition-all hover:scale-105",
        classes.gradientBg,
        classes.textPrimary,
        className,
      )}
    >
      <Zap className="size-3.5" />
      {showLabel && <span className="hidden sm:inline">Foco</span>}
    </Button>
  );
}
