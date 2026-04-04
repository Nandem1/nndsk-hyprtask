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
import { Briefcase, Save } from "lucide-react";
import { useWorkConfig } from "../hooks/useWorkConfig";

export function WorkConfigForm() {
  const { startTime, setStartTime, endTime, setEndTime, isSaving, handleSave } =
    useWorkConfig();

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

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save data-icon="inline-start" />
          {isSaving ? "Guardando..." : "Guardar configuracion"}
        </Button>
      </CardContent>
    </Card>
  );
}
