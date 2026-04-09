"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Tag, Save, Smile } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { RichText } from "@/entities/emote";
import { EmoteGridPicker } from "@/features/emote-picker/ui/EmoteGridPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 4, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: EASE, delay: i * 0.03 },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
};

export interface NotesSectionHandle {
  startEdit: () => void;
  save: () => void;
  isEditing: () => boolean;
}

export const NotesSection = forwardRef<
  NotesSectionHandle,
  {
    initialNotes: string;
    onSave: (notes: string) => void;
  }
>(function NotesSection({ initialNotes, onSave }, ref) {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaElRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    const id = requestAnimationFrame(() => textareaElRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [isEditing]);

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

  useImperativeHandle(
    ref,
    () => ({
      startEdit: () => setIsEditing(true),
      save: () => {
        if (isEditing) handleSave();
      },
      isEditing: () => isEditing,
    }),
    [isEditing, handleSave],
  );

  const handleInsertEmote = useCallback((name: string) => {
    const el = textareaElRef.current;
    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      setNotes((prev) => `${prev.slice(0, start)}${name} ${prev.slice(end)}`);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + name.length + 1;
        el.focus();
      });
    } else {
      setNotes((prev) => `${prev} ${name}`);
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-medium flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
          <Tag className="size-4" />
          Notas y código
        </h3>

        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="flex items-center gap-1.5"
              >
                <motion.div
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={0}
                >
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-1.5 h-8"
                  >
                    <Save className="size-3.5" />
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                </motion.div>
                <motion.div
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={1}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="h-8"
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={2}
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Smile className="size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" side="top" className="w-72 p-3">
                      <EmoteGridPicker onInsert={handleInsertEmote} />
                    </PopoverContent>
                  </Popover>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="viewing"
                variants={staggerItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={0}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8"
                >
                  Editar
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative">
        <Textarea
          ref={textareaElRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Escribe aquí tus notas, comandos SQL, snippets de código..."
          className={cn(
            "min-h-[16rem] font-mono text-sm resize-none [field-sizing:fixed]",
            "border-border/50 bg-muted/30",
            isEditing
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none absolute inset-0",
          )}
        />
        {!isEditing && (
          <div
            onClick={() => setIsEditing(true)}
            className={cn(
              "min-h-[16rem] p-4 rounded-lg border border-l-2 cursor-text font-mono text-sm transition-all duration-200",
              notes
                ? "bg-muted/30 border-border/50 border-l-transparent"
                : "bg-muted/10 border-border/30 border-l-transparent text-muted-foreground italic",
              "hover:border-border hover:bg-muted/20 hover:border-l-primary/40",
            )}
          >
            {notes ? (
              <RichText
                text={notes}
                emoteSize="2x"
                className="whitespace-pre-wrap"
              />
            ) : (
              "Haz click aquí para agregar notas, comandos SQL, links..."
            )}
          </div>
        )}
      </div>
    </div>
  );
});
