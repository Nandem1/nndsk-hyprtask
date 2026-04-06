import { cn } from "@/shared/lib/utils";
import { type ReactNode } from "react";

interface KeyboardShortcutBadgeProps {
  children: ReactNode;
  className?: string;
}

export function KeyboardShortcutBadge({ children, className }: KeyboardShortcutBadgeProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2",
        "rounded-md border border-border bg-muted",
        "text-xs font-mono font-medium text-muted-foreground",
        "shadow-[0_1px_0_1px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
