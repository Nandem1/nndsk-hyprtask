import {
  SleepTimerCard,
  SleepStatsCard,
  WindDownCard,
  SleepConfigForm,
} from "@/entities/sleep";

export default function SleepPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Control de Sueno
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu descanso de forma inteligente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SleepTimerCard />
            <SleepStatsCard />
          </div>
          <div className="space-y-6">
            <SleepConfigForm />
            <WindDownCard />
          </div>
        </div>
      </div>
    </div>
  );
}
