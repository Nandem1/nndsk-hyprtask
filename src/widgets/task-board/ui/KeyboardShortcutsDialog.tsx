"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { KeyboardShortcutBadge } from "@/shared/ui/keyboard-shortcut-badge";
import { Keyboard } from "lucide-react";
import {
  SHORTCUTS_ENTRIES,
  SHORTCUT_GROUPS_ORDER,
  type ShortcutId,
  type ShortcutDef,
} from "@/shared/lib/keyboard-shortcuts";

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type GroupedShortcut = {
  label: string;
  entries: [ShortcutId, ShortcutDef][];
};

const GROUPED_SHORTCUTS: GroupedShortcut[] = SHORTCUT_GROUPS_ORDER.map(
  (group) => ({
    label: group,
    entries: SHORTCUTS_ENTRIES.filter(([, s]) => s.group === group),
  }),
);

export function KeyboardShortcutsDialog({
  isOpen,
  onClose,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="default" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-5" />
            Atajos de teclado
          </DialogTitle>
          <DialogDescription>
            Usa estos atajos para navegar mas rapido
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-2">
          {GROUPED_SHORTCUTS.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {group.label}
              </h3>
              <div className="flex flex-col gap-1.5">
                {group.entries.map(([id, shortcut]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 py-1"
                  >
                    <span className="text-sm text-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={key} className="flex items-center gap-1">
                          {i > 0 && (
                            <span className="text-xs text-muted-foreground">
                              /
                            </span>
                          )}
                          <KeyboardShortcutBadge>{key}</KeyboardShortcutBadge>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
