"use client";

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
import { Switch } from "@/shared/ui/switch";
import { Settings, Save } from "lucide-react";
import { useSleepConfig } from "../hooks/useSleepConfig";

export function SleepConfigForm() {
  const {
    wakeupTime,
    setWakeupTime,
    desiredSleepHours,
    setDesiredSleepHours,
    sleepReminders,
    setSleepReminders,
    isSaving,
    handleSave,
  } = useSleepConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="size-5" />
          Configuracion de Sueno
        </CardTitle>
        <CardDescription>
          Define tus horarios ideales de descanso
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
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

        <div className="flex items-center gap-3">
          <Switch
            id="reminders"
            checked={sleepReminders}
            onCheckedChange={setSleepReminders}
          />
          <Label htmlFor="reminders" className="cursor-pointer">
            Activar recordatorios inteligentes
          </Label>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save data-icon="inline-start" />
          {isSaving ? "Guardando..." : "Guardar configuracion"}
        </Button>
      </CardContent>
    </Card>
  );
}
