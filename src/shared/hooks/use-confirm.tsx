"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmContext = createContext<{
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}>({
  confirm: () => Promise.resolve(false),
});

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    options: { title: "", description: "" },
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          options: {
            ...options,
            confirmText: options.confirmText ?? "Confirmar",
            cancelText: options.cancelText ?? "Cancelar",
            variant: options.variant ?? "default",
          },
          onConfirm: () => {
            setState((prev) => ({ ...prev, isOpen: false }));
            resolve(true);
          },
          onCancel: () => {
            setState((prev) => ({ ...prev, isOpen: false }));
            resolve(false);
          },
        });
      });
    },
    []
  );

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={state.isOpen} onOpenChange={(open) => !open && state.onCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{state.options.title}</DialogTitle>
            <DialogDescription>{state.options.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={state.onCancel}>
              {state.options.cancelText}
            </Button>
            <Button
              variant={state.options.variant === "destructive" ? "destructive" : "default"}
              onClick={state.onConfirm}
            >
              {state.options.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const { confirm } = useContext(ConfirmContext);
  return { confirm };
}
