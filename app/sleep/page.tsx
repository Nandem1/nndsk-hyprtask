import dynamic from "next/dynamic";
import { Header } from "@/widgets";
import { SleepPageSkeleton } from "./SleepPageSkeleton";

const SleepDashboard = dynamic(
  () => import("@/widgets/sleep-dashboard").then((mod) => mod.SleepDashboard),
  {
    ssr: false,
    loading: () => <SleepPageSkeleton />,
  },
);

// Server Component - Main Page
export default function SleepPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SleepDashboard />
      </main>
    </div>
  );
}
