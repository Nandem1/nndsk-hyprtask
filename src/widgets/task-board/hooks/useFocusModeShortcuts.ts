import { useHotkeys } from "react-hotkeys-hook";
import type { CountdownState } from "@/shared/hooks/use-countdown-timer";
import { SHORTCUTS } from "@/shared/lib/keyboard-shortcuts";

interface UseFocusModeShortcutsOptions {
  isOpen: boolean;
  timerState: CountdownState;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkipBreak: () => void;
  onOpenEndDialog: () => void;
}

export function useFocusModeShortcuts({
  isOpen,
  timerState,
  onPlay,
  onPause,
  onReset,
  onSkipBreak,
  onOpenEndDialog,
}: UseFocusModeShortcutsOptions) {
  // Space → play when idle/paused, pause when running
  useHotkeys(
    SHORTCUTS.FOCUS_PLAY_PAUSE.hotkeyString,
    (e) => {
      e.preventDefault();
      if (timerState === "running") {
        onPause();
      } else if (timerState === "idle" || timerState === "paused") {
        onPlay();
      }
    },
    { enabled: isOpen && timerState !== "break" && timerState !== "completed" },
    [isOpen, timerState, onPlay, onPause],
  );

  // p → pause (only when running)
  useHotkeys(
    SHORTCUTS.FOCUS_PAUSE.hotkeyString,
    () => {
      if (timerState === "running") onPause();
    },
    { enabled: isOpen && timerState === "running" },
    [isOpen, timerState, onPause],
  );

  // r → reset
  useHotkeys(
    SHORTCUTS.FOCUS_RESET.hotkeyString,
    () => onReset(),
    { enabled: isOpen && (timerState === "running" || timerState === "paused") },
    [isOpen, timerState, onReset],
  );

  // c → open end dialog (complete task flow)
  useHotkeys(
    SHORTCUTS.FOCUS_COMPLETE.hotkeyString,
    () => onOpenEndDialog(),
    { enabled: isOpen && timerState !== "break" },
    [isOpen, timerState, onOpenEndDialog],
  );

  // b → skip break
  useHotkeys(
    SHORTCUTS.FOCUS_SKIP_BREAK.hotkeyString,
    () => onSkipBreak(),
    { enabled: isOpen && timerState === "break" },
    [isOpen, timerState, onSkipBreak],
  );
}
