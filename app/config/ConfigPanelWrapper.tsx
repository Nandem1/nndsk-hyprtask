"use client";

import dynamic from "next/dynamic";
import { ConfigPanelSkeleton } from "@/widgets/config-panel/ui/ConfigPanelSkeleton";

const ConfigPanel = dynamic(
  () => import("@/widgets/config-panel").then((mod) => mod.ConfigPanel),
  {
    ssr: false,
    loading: () => <ConfigPanelSkeleton />,
  },
);

export function ConfigPanelWrapper() {
  return <ConfigPanel />;
}
