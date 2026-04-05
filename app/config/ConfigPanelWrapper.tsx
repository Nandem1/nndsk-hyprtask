"use client";

import dynamic from "next/dynamic";

const ConfigPanel = dynamic(
  () => import("@/widgets/config-panel").then((mod) => mod.ConfigPanel),
  {
    ssr: false,
  },
);

export function ConfigPanelWrapper() {
  return <ConfigPanel />;
}
