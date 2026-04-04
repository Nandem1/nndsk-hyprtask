"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Tag, Save, Smile } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { RichText } from "./ConnectedRichText";
import { EmotePicker } from "@/features/emote-picker";

export function NotesSection({
  initialNotes,
  onSave,
}: {
  initialNotes: string;
  onSave: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmotePicker, setShowEmotePicker] = useState(false);
  const textareaElRef = useRef<HTMLTextAreaElement>(null);

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

  const handleInsertEmote = useCallback((name: string) => {
    setNotes((prev) => {
      const el = textareaElRef.current;
      if (el) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const before = prev.slice(0, start);
        const after = prev.slice(end);
        const next = `${before}${name} ${after}`;
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + name.length + 1;
        });
        return next;
      }
      return `${prev} ${name}`;
    });
    setShowEmotePicker(false);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-medium flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
          <Tag className="size-4" />
          Notas y código
        </h3>
        {!isEditing && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmotePicker(!showEmotePicker)}
              className="h-8 transition-colors"
            >
              <Smile className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 transition-colors"
            >
              Editar
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showEmotePicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-border bg-card shadow-lg">
              <EmotePicker
                onInsert={handleInsertEmote}
                onClose={() => setShowEmotePicker(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                ref={textareaElRef}
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
                "min-h-[200px] p-4 rounded-lg border transition-colors cursor-text font-mono text-sm",
                notes
                  ? "bg-muted/30 border-border/50"
                  : "bg-muted/10 border-border/30 text-muted-foreground italic",
                "hover:border-border hover:bg-muted/20",
              )}
            >
              {notes ? (
                <RichText text={notes} emoteSize="2x" className="whitespace-pre-wrap" />
              ) : (
                "Haz click aquí para agregar notas, comandos SQL, links..."
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
