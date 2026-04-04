"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { EmptyState } from "@/shared/ui/empty-state";
import { BarChart3, TrendingUp } from "lucide-react";
import { useSleepLogs } from "../hooks/use-sleep-settings";
import { useSleepStats } from "../hooks/use-sleep-stats";

export function SleepStatsCard() {
  const { data: allLogs = [] } = useSleepLogs();
  const { logs, averageHours, averageQuality } = useSleepStats(allLogs);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="size-5" />
          Estadisticas Semanales
        </CardTitle>
        <CardDescription>Resumen de tus ultimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {logs.length === 0 ? (
          <EmptyState
            title="No hay registros aun"
            description="Registra tu sueno para ver estadisticas"
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-semibold">
                  {averageHours > 0 ? averageHours.toFixed(1) : "--"}h
                </div>
                <div className="text-xs text-muted-foreground">
                  Promedio de sueno
                </div>
              </div>
              <div>
                <div className="text-2xl font-semibold">
                  {averageQuality > 0 ? averageQuality.toFixed(1) : "--"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Calidad promedio
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <TrendingUp className="size-4" />
                Registros recientes
              </div>
              <div className="flex flex-col gap-2">
                {logs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>
                      {new Date(log.date).toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-muted-foreground">
                      {log.actualBedtime && log.actualWakeup
                        ? `${log.actualBedtime} - ${log.actualWakeup}`
                        : "Sin registro"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
