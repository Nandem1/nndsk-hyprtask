"use client";

import { useMemo } from "react";
import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Clock, Moon } from "lucide-react";
import {
  useSleepSettings,
  useSleepCalculations,
} from "../hooks/use-sleep-settings";
import { generateSleepAlert } from "../lib/calculations";
import { formatMinutesToReadable } from "@/shared/lib/time-utils";
import type { ExtendedThemeClasses } from "@/shared/types/theme";

export function SleepTimerCard({ themeClasses }: { themeClasses: ExtendedThemeClasses }) {
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
            <Moon className="size-5" />
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
    <Card className={cn("border-2", themeClasses.border)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5" />
          Hora de dormir recomendada
        </CardTitle>
        <CardDescription>
          Alarma: {settings.wakeupTime} | {settings.desiredSleepHours}h de sueno
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-center">
          <div
            className={cn(
              "text-5xl font-bold tracking-tight",
              themeClasses.textPrimary,
            )}
          >
            {sleepData?.recommendedBedtime || "--:--"}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Debes dormir a las{" "}
            <span className={cn("font-semibold", themeClasses.textPrimary)}>
              {sleepData?.recommendedBedtime || "--:--"}
            </span>{" "}
            para despertar a las{" "}
            <span className={cn("font-semibold", themeClasses.textSecondary)}>
              {settings.wakeupTime}
            </span>
          </div>
        </div>

        <Separator />

        <div className="text-center">
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

        {alert && alert.level !== "none" ? (
          <Alert
            variant={alert.level === "critical" ? "destructive" : "default"}
            className={
              alert.level !== "critical"
                ? "border-primary/20 bg-primary/10 text-primary"
                : undefined
            }
          >
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ) : null}

        <Separator />

        <div className="grid grid-cols-2 gap-4">
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
