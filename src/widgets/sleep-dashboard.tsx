'use client';

import { useThemeContext } from '@/features/theme-switcher';
import { SleepTimerCard, SleepStatsCard, WindDownCard } from '@/entities/sleep';
import { WorkTimerCard } from '@/entities/work';

export function SleepDashboard() {
  const { classes } = useThemeContext();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className={`text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r ${classes.gradient} bg-clip-text text-transparent`}>
          Control de Sueno
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu descanso y horario laboral de forma inteligente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SleepTimerCard />
          <SleepStatsCard />
        </div>
        <div className="space-y-6">
          <WorkTimerCard />
          <WindDownCard />
        </div>
      </div>
    </div>
  );
}
