"use client";

import dynamic from "next/dynamic";
import { SleepPageSkeleton } from "./SleepPageSkeleton";

const SleepDashboard = dynamic(
  () => import("@/widgets/sleep-dashboard").then((mod) => mod.SleepDashboard),
  {
    ssr: false,
    loading: () => <SleepPageSkeleton />,
  },
);

export function SleepDashboardWrapper() {
  return <SleepDashboard />;
}
