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
import { Briefcase, Save } from "lucide-react";
import {
  useWorkSettings,
  useSaveWorkSettings,
} from "../hooks/use-work-settings";
import type { WorkSettings } from "../model/types";

export function WorkConfigForm() {
  const { data: settings } = useWorkSettings();
  const saveSettingsMutation = useSaveWorkSettings();

  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("18:00");

  useEffect(() => {
    if (settings) {
      setStartTime(settings.startTime);
      setEndTime(settings.endTime);
    }
  }, [settings]);

  const handleSave = () => {
    const newSettings: WorkSettings = {
      id: settings?.id || crypto.randomUUID(),
      startTime,
      endTime,
      updatedAt: new Date().toISOString(),
      ...(settings?.createdAt && { createdAt: settings.createdAt }),
    };

    saveSettingsMutation.mutate(newSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="size-5" />
          Configuracion Laboral
        </CardTitle>
        <CardDescription>Define tus horarios de trabajo</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startTime">Hora de entrada</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            A que hora empiezas a trabajar
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="endTime">Hora de salida</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            A que hora terminas de trabajar
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saveSettingsMutation.isPending}
          className="w-full"
        >
          <Save data-icon="inline-start" />
          {saveSettingsMutation.isPending
            ? "Guardando..."
            : "Guardar configuracion"}
        </Button>
      </CardContent>
    </Card>
  );
}
