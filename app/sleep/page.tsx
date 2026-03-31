import { Suspense } from "react";
import { Header } from "@/widgets";
import { SleepDashboard } from "@/widgets";
import { SleepPageSkeleton } from "./SleepPageSkeleton";

// Server Component - Main Page
export default function SleepPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Suspense fallback={<SleepPageSkeleton />}>
          <SleepDashboard />
        </Suspense>
      </main>
    </div>
  );
}
