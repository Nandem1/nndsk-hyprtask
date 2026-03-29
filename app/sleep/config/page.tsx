"use client";

import { ConfigPanel, Header } from "@/widgets";

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ConfigPanel />
      </main>
    </div>
  );
}
