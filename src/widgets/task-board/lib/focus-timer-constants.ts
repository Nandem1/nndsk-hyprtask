import { formatTime } from "@shared/lib/time-utils";
import type { MutableRefObject } from "react";

export { formatTime };

export const FOCUS_DURATION = 25 * 60;
export const BREAK_DURATION = 5 * 60;
export const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 45;

export function getElapsedMinutes(
  timeLeftRef: MutableRefObject<number>,
  focusDuration: number = FOCUS_DURATION,
): number {
  return Math.round((focusDuration - timeLeftRef.current) / 60);
}

export {
  fullscreenContainerVariants as containerVariants,
  contentVariants,
  timerModeVariants,
} from "@/shared/lib/animations";
