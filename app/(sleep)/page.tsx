import { SleepTimer } from '@/components/sleep/sleep-timer';
import { SleepConfig } from '@/components/sleep/sleep-config';
import { SleepStats } from '@/components/sleep/sleep-stats';
import { WindDown } from '@/components/sleep/wind-down';

export default function SleepPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
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
            <SleepConfig />
            <WindDown />
          </div>
        </div>
      </div>
    </div>
  );
}

