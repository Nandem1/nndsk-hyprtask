"use client";

import { cn } from "@/shared/lib/utils";
import { Settings } from "lucide-react";
import { getEntityIcon } from "@/entities/project";
import { Button } from "@/shared/ui/button";
import type { ExtendedThemeClasses } from "@/shared/types/theme";

interface FilterItem {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface FilterSectionProps {
  headerIcon: React.ReactNode;
  label: string;
  items: FilterItem[];
  selectedId: string | "all";
  onSelect: (id: string | "all") => void;
  onSettings: () => void;
  themeClasses: ExtendedThemeClasses;
}

export function FilterSection({
  headerIcon,
  label,
  items,
  selectedId,
  onSelect,
  onSettings,
  themeClasses,
}: FilterSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {headerIcon}
          {label}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={onSettings}
        >
          <Settings />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const IconComponent = getEntityIcon(item.icon);
          const isSelected = selectedId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isSelected
                  ? cn("bg-accent border", themeClasses.border)
                  : "border border-transparent hover:bg-accent/50",
              )}
            >
              <div className="flex items-center gap-3">
                <IconComponent
                  className={cn(
                    "size-4",
                    isSelected ? themeClasses.textPrimary : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    isSelected && cn(themeClasses.textPrimary, "font-medium"),
                    !isSelected && "text-foreground",
                  )}
                >
                  {item.name}
                </span>
              </div>
              {item.count > 0 ? (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    isSelected
                      ? cn(themeClasses.textPrimary, "bg-primary/10")
                      : "text-muted-foreground bg-muted",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
