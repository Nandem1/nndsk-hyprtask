import { formatTime } from "@shared/lib/time-utils";

export { formatTime };

export const FOCUS_DURATION = 25 * 60;
export const BREAK_DURATION = 5 * 60;
export const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 45;

export {
  fullscreenContainerVariants as containerVariants,
  contentVariants,
  timerModeVariants,
} from "@/shared/lib/animations";
