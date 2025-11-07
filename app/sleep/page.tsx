'use client';

import LayoutWithHeader from '../layout-with-header';
import { SleepTimer } from '@/components/sleep/sleep-timer';
import { SleepStats } from '@/components/sleep/sleep-stats';
import { WindDown } from '@/components/sleep/wind-down';
import { useThemeContext } from '@/components/theme-provider-context';

function SleepPageContent() {
  const { classes } = useThemeContext();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className={`text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r ${classes.gradient} bg-clip-text text-transparent`}>
          Control de Sueño
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu descanso de forma inteligente
        </p>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-6">
          <SleepTimer />
          <SleepStats />
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <WindDown />
        </div>
      </div>
    </div>
  );
}

export default function SleepPage() {
  return (
    <LayoutWithHeader>
      <SleepPageContent />
    </LayoutWithHeader>
  );
}

