"use client";

import dynamic from "next/dynamic";

const WorkDashboard = dynamic(
  () => import("@/widgets/work-dashboard").then((mod) => mod.WorkDashboard),
  { ssr: false },
);

export function WorkPageWrapper() {
  return <WorkDashboard />;
}
