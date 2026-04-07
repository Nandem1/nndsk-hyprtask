"use client";

import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Clock, Briefcase } from "lucide-react";
import {
  useWorkSettings,
  useWorkCalculations,
} from "../hooks/use-work-settings";
import { formatMinutesToReadable } from "@/shared/lib/time-utils";
import type { ExtendedThemeClasses } from "@/shared/types/theme";

export function WorkTimerCard({ themeClasses }: { themeClasses: ExtendedThemeClasses }) {
  const { data: settings } = useWorkSettings();
  const { data: workData } = useWorkCalculations();

  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="size-5" />
            Horario Laboral
          </CardTitle>
          <CardDescription>
            Configura tus horarios de trabajo para comenzar
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isWorking = workData?.isWorking ?? false;
  const displayTime = isWorking ? workData?.endTime : workData?.startTime;
  const timeUntil = isWorking ? workData?.timeUntilEnd : workData?.timeUntilStart;
  const timeLabel = isWorking ? "para salir" : "para entrar";
  const description = isWorking
    ? `Sales a las ${workData?.endTime ?? "--:--"}`
    : `Entras a las ${workData?.startTime ?? "--:--"}`;

  const totalHours = Math.floor(workData?.workHours ?? 0);
  const totalMins = Math.round(((workData?.workHours ?? 0) - totalHours) * 60);
  const workHoursFormatted = totalMins > 0 ? `${totalHours}h ${totalMins}m` : `${totalHours}h`;

  return (
    <Card className={cn("border-2", themeClasses.border)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5" />
          Horario laboral
        </CardTitle>
        <CardDescription>
          Entrada: {settings.startTime} | Salida: {settings.endTime}
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
            {displayTime || "--:--"}
          </div>
          <div className="text-sm text-muted-foreground mt-2">{description}</div>
        </div>

        <Separator />

        <div className="text-center">
          <div className="text-lg font-semibold">
            {timeUntil != null ? formatMinutesToReadable(timeUntil) : "--"}{" "}
            {timeLabel}
          </div>
          <div className="text-xs text-muted-foreground">
            {isWorking ? "Tiempo hasta la hora de salida" : "Tiempo hasta la hora de entrada"}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-semibold">{workHoursFormatted}</div>
            <div className="text-xs text-muted-foreground">Horas de trabajo</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{settings.startTime}</div>
            <div className="text-xs text-muted-foreground">Hora de entrada</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
