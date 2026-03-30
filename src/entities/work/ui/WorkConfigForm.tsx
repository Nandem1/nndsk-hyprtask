"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { useTheme } from "@/store/hooks";
import type { WorkSettings } from "../model/types";

export function WorkConfigForm() {
  const { themeClasses } = useTheme();
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card
        className={`relative overflow-hidden border ${themeClasses.border} bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm shadow-xl ${themeClasses.shadow} transition-all duration-300 hover:shadow-2xl ${themeClasses.shadowHover} hover:${themeClasses.borderHover}`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r ${themeClasses.gradientBgSubtle} opacity-50`}
        />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Configuracion Laboral
          </CardTitle>
          <CardDescription>Define tus horarios de trabajo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
