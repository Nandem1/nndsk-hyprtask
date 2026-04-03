"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { transitions } from "@/shared/lib/animations";
import { Check, Tag, Save } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

interface NotesSectionProps {
  initialNotes: string;
  onSave: (notes: string) => void;
}

export function NotesSection({
  initialNotes,
  onSave,
}: NotesSectionProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await onSave(notes);
    setIsSaving(false);
    setIsEditing(false);
  }, [notes, onSave]);

  const handleCancel = useCallback(() => {
    setNotes(initialNotes);
    setIsEditing(false);
  }, [initialNotes]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-medium flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
          <Tag className="size-4" />
          Notas y codigo
        </h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 transition-colors"
          >
            Editar
          </Button>
        )}
      </div>

      <motion.div layout transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col gap-3"
            >
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escribe aquí tus notas, comandos SQL, snippets de código..."
                className="min-h-[16rem] font-mono text-sm resize-none"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-1.5 transition-all hover:scale-105"
                >
                  <Save className="size-3.5" />
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="transition-colors"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              onClick={() => setIsEditing(true)}
              className={cn(
                "min-h-[200px] p-4 rounded-lg border transition-colors cursor-text whitespace-pre-wrap font-mono text-sm",
                notes
                  ? "bg-muted/30 border-border/50"
                  : "bg-muted/10 border-border/30 text-muted-foreground italic",
                "hover:border-border hover:bg-muted/20",
              )}
            >
              {notes || "Haz click aquí para agregar notas, comandos SQL, links..."}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
