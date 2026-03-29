"use client";

import { SleepDashboard, Header } from "@/widgets";

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
