"use client";

import { useTheme } from "@/store/hooks";
import { WorkTimerCard } from "@/entities/work";

export function WorkDashboard() {
  const { themeClasses } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1
          className={`text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r ${themeClasses.gradient} bg-clip-text text-transparent`}
        >
          Trabajo
        </h1>
        <p className="text-muted-foreground">
          Controla tu horario laboral
        </p>
      </div>

      <WorkTimerCard themeClasses={themeClasses} />
    </div>
  );
}
