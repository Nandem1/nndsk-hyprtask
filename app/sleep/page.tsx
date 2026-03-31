import { Header } from "@/widgets";
import { SleepDashboardWrapper } from "./SleepDashboardWrapper";

// Server Component - Main Page
export default function SleepPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SleepDashboardWrapper />
      </main>
    </div>
  );
}
