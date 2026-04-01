"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Check, X, LogOut } from "lucide-react";

interface EndSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: () => void;
  onJustClose: () => void;
  taskTitle?: string;
}

export function EndSessionDialog({
  isOpen,
  onClose,
  onCompleteTask,
  onJustClose,
  taskTitle,
}: EndSessionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent size="sm" className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="size-5" />
            ¿Qué deseas hacer?
          </DialogTitle>
          <DialogDescription>
            La sesión de foco ha terminado
            {taskTitle ? (
              <>
                {" "}
                con <strong>{taskTitle}</strong>
              </>
            ) : null}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <button
            onClick={() => {
              onCompleteTask();
              onClose();
            }}
            className="flex items-start gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-left"
          >
            <div className="mt-0.5">
              <Check className="size-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">Completar tarea</div>
              <div className="text-sm text-muted-foreground">
                Marca la tarea como hecha y cierra el modo foco
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onJustClose();
              onClose();
            }}
            className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="mt-0.5">
              <LogOut className="size-5 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium">Solo cerrar</div>
              <div className="text-sm text-muted-foreground">
                Cierra el modo foco sin completar la tarea
              </div>
            </div>
          </button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="size-4 mr-2" />
            Cancelar y continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
