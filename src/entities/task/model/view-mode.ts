export type { TaskViewMode } from "@/shared/types/view-mode";

export interface ViewModeConfig {
  id: import("@/shared/types/view-mode").TaskViewMode;
  name: string;
  emoji: string;
  description: string;
}
