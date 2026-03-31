"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Settings, Save } from "lucide-react";
import {
  useSleepSettings,
  useSaveSleepSettings,
} from "../hooks/use-sleep-settings";
import type { SleepSettings } from "../model/types";

export function SleepConfigForm() {
  const { data: settings } = useSleepSettings();
  const saveSettingsMutation = useSaveSleepSettings();

  const [wakeupTime, setWakeupTime] = useState<string>("07:00");
  const [desiredSleepHours, setDesiredSleepHours] = useState<number>(7);
  const [sleepReminders, setSleepReminders] = useState<boolean>(true);

  useEffect(() => {
    if (settings) {
      setWakeupTime(settings.wakeupTime);
      setDesiredSleepHours(settings.desiredSleepHours);
      setSleepReminders(settings.sleepReminders);
    }
  }, [settings]);

  const handleSave = () => {
    const newSettings: SleepSettings = {
      id: settings?.id || crypto.randomUUID(),
      wakeupTime,
      desiredSleepHours,
      sleepReminders,
      updatedAt: new Date().toISOString(),
      ...(settings?.createdAt && { createdAt: settings.createdAt }),
    };

    saveSettingsMutation.mutate(newSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuracion de Sueno
        </CardTitle>
        <CardDescription>
          Define tus horarios ideales de descanso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wakeup">Hora de alarma</Label>
          <Input
            id="wakeup"
            type="time"
            value={wakeupTime}
            onChange={(e) => setWakeupTime(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            A que hora quieres despertar
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sleepHours">Horas de sueno deseadas</Label>
          <Input
            id="sleepHours"
            type="number"
            min="6"
            max="10"
            value={desiredSleepHours}
            onChange={(e) => setDesiredSleepHours(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Cuantas horas de sueno quieres (7 u 8 recomendado)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="reminders"
            checked={sleepReminders}
            onChange={(e) => setSleepReminders(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="reminders" className="cursor-pointer">
            Activar recordatorios inteligentes
          </Label>
        </div>

        <Button
          onClick={handleSave}
          disabled={saveSettingsMutation.isPending}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saveSettingsMutation.isPending
            ? "Guardando..."
            : "Guardar configuracion"}
        </Button>
      </CardContent>
    </Card>
  );
}
