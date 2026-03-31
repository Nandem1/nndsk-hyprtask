import { Suspense } from "react";
import { Header } from "@/widgets";
import { TasksPageContent } from "./TasksPageContent";
import { TasksPageSkeleton } from "./TasksPageSkeleton";

// Server Component - Main Page
export default function TasksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<TasksPageSkeleton />}>
        <TasksPageContent />
      </Suspense>
    </div>
  );
}
