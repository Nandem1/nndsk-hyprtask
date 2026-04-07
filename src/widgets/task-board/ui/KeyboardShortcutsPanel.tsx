"use client";

import { Keyboard, ChevronRight, ChevronLeft } from "lucide-react";
import { KeyboardShortcutBadge } from "@/shared/ui/keyboard-shortcut-badge";
import {
  SHORTCUTS_ENTRIES,
  type ShortcutId,
  type ShortcutDef,
} from "@/shared/lib/keyboard-shortcuts";
import { useUIPreferencesState, useUIPreferencesActions } from "@/store/hooks";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

type GroupedShortcut = {
  label: string;
  entries: [ShortcutId, ShortcutDef][];
};

function buildGroup(label: string): GroupedShortcut {
  return {
    label,
    entries: SHORTCUTS_ENTRIES.filter(([, s]) => s.group === label),
  };
}

const LEFT_GROUPS: GroupedShortcut[] = [
  buildGroup("Navegacion"),
  buildGroup("Tareas"),
  buildGroup("En detalle"),
];

const RIGHT_GROUPS: GroupedShortcut[] = [
  buildGroup("En foco"),
  buildGroup("Vistas"),
  buildGroup("Interfaz"),
  buildGroup("General"),
  buildGroup("Ir a"),
];

const CONTEXT_LABEL: Record<string, string> = {
  "En detalle": "modal detalle",
  "En foco": "modo foco",
};

interface KeyboardShortcutsPanelProps {
  leaderActive?: boolean;
}

export function KeyboardShortcutsPanel({ leaderActive = false }: KeyboardShortcutsPanelProps) {
  const { isShortcutsPanelCollapsed } = useUIPreferencesState();
  const { toggleShortcutsPanel } = useUIPreferencesActions();

  if (isShortcutsPanelCollapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <aside className="shrink-0 sticky top-4 hidden lg:flex flex-col items-center w-10 border-l border-border/40 pl-2 pt-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleShortcutsPanel}
                className="flex flex-col items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Expandir atajos"
              >
                <Keyboard className="size-4" />
                <ChevronLeft className="size-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Atajos de teclado</TooltipContent>
          </Tooltip>
        </aside>
      </TooltipProvider>
    );
  }

  return (
    <aside className={cn(
      "w-[18rem] shrink-0 sticky top-4 hidden lg:block",
      "border-l border-border/40 pl-4",
      "transition-all duration-200",
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Keyboard className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Atajos
          </span>
        </div>
        <div className="flex items-center gap-1">
          {leaderActive && (
            <div className="flex items-center gap-1">
              <KeyboardShortcutBadge className="text-[10px] min-w-[1.25rem] h-5 px-1 ring-1 ring-primary animate-pulse">
                g
              </KeyboardShortcutBadge>
              <span className="text-[10px] text-primary">→</span>
            </div>
          )}
          <button
            onClick={toggleShortcutsPanel}
            className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Colapsar atajos"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-0 items-start">
        <ShortcutColumn groups={LEFT_GROUPS} leaderActive={leaderActive} />
        <ShortcutColumn groups={RIGHT_GROUPS} leaderActive={leaderActive} />
      </div>
    </aside>
  );
}

function ShortcutColumn({
  groups,
  leaderActive,
}: {
  groups: GroupedShortcut[];
  leaderActive: boolean;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </h3>
            {CONTEXT_LABEL[group.label] && (
              <span className="text-[9px] text-muted-foreground/50 italic">
                {CONTEXT_LABEL[group.label]}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            {group.entries.map(([id, shortcut]) => (
              <div key={id} className="flex items-center justify-between gap-1.5">
                <span className="text-[11px] text-muted-foreground truncate leading-5">
                  {shortcut.description}
                </span>
                <div className="flex items-center gap-0.5 shrink-0">
                  {shortcut.isSequence ? (
                    <SequenceKeys keys={shortcut.keys} active={leaderActive} />
                  ) : (
                    shortcut.keys.map((key, i) => (
                      <span key={key} className="flex items-center gap-0.5">
                        {i > 0 && (
                          <span className="text-[10px] text-muted-foreground">/</span>
                        )}
                        <KeyboardShortcutBadge className="text-[10px] min-w-[1.25rem] h-5 px-1">
                          {key}
                        </KeyboardShortcutBadge>
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SequenceKeys({ keys, active }: { keys: string[]; active: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {keys.map((key, i) => (
        <span key={key} className="flex items-center gap-0.5">
          {i > 0 && (
            <span className="text-[10px] text-muted-foreground/50">→</span>
          )}
          <KeyboardShortcutBadge
            className={cn(
              "text-[10px] min-w-[1.25rem] h-5 px-1 transition-colors",
              active && i === 0 && "ring-1 ring-primary text-primary",
            )}
          >
            {key}
          </KeyboardShortcutBadge>
        </span>
      ))}
    </div>
  );
}
