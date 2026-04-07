"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme, useUIPreferencesState } from "@/store/hooks";
import { autoArchiveCompletedTasks } from "@/entities/task/lib/storage";
import { TaskSidebar } from "@/widgets/task-sidebar";
import { KeyboardShortcutsPanel } from "@/widgets/task-board";
import { Sheet, SheetContent } from "@/shared/ui/sheet";

const TaskBoard = dynamic(
  () => import("@/widgets/task-board").then((mod) => mod.TaskBoard),
  { ssr: false },
);

export function TasksPageContent() {
  useTheme(); // keep theme subscription for SSR hydration
  const { isSidebarCollapsed, isLeaderActive } = useUIPreferencesState();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    autoArchiveCompletedTasks();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3rem)] relative">
      {/* Sidebar Desktop */}
      <div className="hidden md:block shrink-0">
        <TaskSidebar />
      </div>

      {/* Mobile Sheet */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <TaskSidebar />
        </SheetContent>
      </Sheet>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className={`mx-auto px-4 pt-4 pb-6 ${isSidebarCollapsed ? "max-w-6xl" : "max-w-5xl"}`}>
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <TaskBoard onMobileFilter={() => setMobileFilterOpen(true)} />
            </div>
            <KeyboardShortcutsPanel leaderActive={isLeaderActive} />
          </div>
        </div>
      </div>
    </div>
  );
}
