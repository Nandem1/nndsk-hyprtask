"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Clock, Briefcase } from "lucide-react";
import {
  useWorkSettings,
  useWorkCalculations,
} from "../hooks/use-work-settings";
import { formatMinutesToReadable } from "@/shared/lib/time-utils";
import { useThemeState } from "@/store/hooks";

export function WorkTimerCard() {
  const { themeClasses } = useThemeState();
  const { data: settings } = useWorkSettings();
  const { data: workData } = useWorkCalculations();

  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Horario Laboral
          </CardTitle>
          <CardDescription>
            Configura tus horarios de trabajo para comenzar
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
          Hora de salida
        </CardTitle>
        <CardDescription>
          Entrada: {settings.startTime} | Salida: {settings.endTime}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hora de salida */}
        <div className="text-center">
          <div
            className={`text-5xl font-bold tracking-tight ${themeClasses.textPrimary}`}
          >
            {workData?.endTime || "--:--"}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Sales a las{" "}
            <span className={`font-semibold ${themeClasses.textPrimary}`}>
              {workData?.endTime || "--:--"}
            </span>
          </div>
        </div>

        {/* Tiempo restante */}
        <div className="text-center pt-2 border-t">
          <div className="text-lg font-semibold">
            {workData ? formatMinutesToReadable(workData.timeUntilEnd) : "--"}{" "}
            restantes
          </div>
          <div className="text-xs text-muted-foreground">
            Tiempo hasta la hora de salida
          </div>
        </div>

        {/* Informacion de trabajo */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-2xl font-semibold">
              {workData ? workData.workHours.toFixed(1) : "0.0"}h
            </div>
            <div className="text-xs text-muted-foreground">
              Horas de trabajo
            </div>
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
