"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Clock, Moon } from "lucide-react";
import {
  useSleepSettings,
  useSleepCalculations,
} from "../hooks/use-sleep-settings";
import { generateSleepAlert } from "../lib/calculations";
import { formatMinutesToReadable } from "@/shared/lib/time-utils";
import { useThemeState } from "@/store/hooks";

export function SleepTimerCard() {
  const { themeClasses } = useThemeState();
  const { data: settings } = useSleepSettings();
  const { data: sleepData } = useSleepCalculations();

  const alert = useMemo(() => {
    if (!sleepData || !settings) return null;
    return generateSleepAlert(
      sleepData.timeUntilBedtime,
      settings.sleepReminders,
    );
  }, [sleepData, settings]);

  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Control de Sueno
          </CardTitle>
          <CardDescription>
            Configura tus horarios de sueno para comenzar
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${themeClasses.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Hora de dormir recomendada
        </CardTitle>
        <CardDescription>
          Alarma: {settings.wakeupTime} | {settings.desiredSleepHours}h de sueno
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hora recomendada */}
        <div className="text-center">
          <div
            className={`text-5xl font-bold tracking-tight ${themeClasses.textPrimary}`}
          >
            {sleepData?.recommendedBedtime || "--:--"}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Debes dormir a las{" "}
            <span className={`font-semibold ${themeClasses.textPrimary}`}>
              {sleepData?.recommendedBedtime || "--:--"}
            </span>{" "}
            para despertar a las{" "}
            <span className={`font-semibold ${themeClasses.textSecondary}`}>
              {settings.wakeupTime}
            </span>
          </div>
        </div>

        {/* Tiempo restante */}
        <div className="text-center pt-2 border-t">
          <div className="text-lg font-semibold">
            {sleepData
              ? formatMinutesToReadable(sleepData.timeUntilBedtime)
              : "--"}{" "}
            restantes
          </div>
          <div className="text-xs text-muted-foreground">
            Tiempo hasta la hora de dormir
          </div>
        </div>

        {/* Alerta */}
        {alert && alert.level !== "none" && (
          <div
            className={`rounded-lg p-3 text-sm ${
              alert.level === "critical"
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Informacion de sueno */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-2xl font-semibold">
              {sleepData ? sleepData.totalSleepHours.toFixed(1) : "0.0"}h
            </div>
            <div className="text-xs text-muted-foreground">Horas de sueno</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">
              {sleepData?.sleepCycles || 0}
            </div>
            <div className="text-xs text-muted-foreground">Ciclos de 90min</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
