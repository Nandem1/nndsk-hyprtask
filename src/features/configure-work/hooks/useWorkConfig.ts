"use client";

import { useState, useEffect } from "react";
import { useWorkSettings, useSaveWorkSettings, type WorkSettings } from "@/entities/work";
import { buildSettingsPayload } from "@/shared/lib/form";
import { defaultValues } from "../model/types";

export function useWorkConfig() {
  const { data: settings } = useWorkSettings();
  const saveSettingsMutation = useSaveWorkSettings();

  const [startTime, setStartTime] = useState<string>(defaultValues.startTime);
  const [endTime, setEndTime] = useState<string>(defaultValues.endTime);
  const [breakDuration, setBreakDuration] = useState<number>(defaultValues.breakDuration);

  useEffect(() => {
    if (settings) {
      setStartTime(settings.startTime);
      setEndTime(settings.endTime);
      setBreakDuration(settings.breakDuration ?? defaultValues.breakDuration);
    }
  }, [settings]);

  const handleSave = () => {
    saveSettingsMutation.mutate(
      buildSettingsPayload<WorkSettings>(settings ?? undefined, { startTime, endTime, breakDuration }),
    );
  };

  return {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    breakDuration,
    setBreakDuration,
    isSaving: saveSettingsMutation.isPending,
    handleSave,
  };
}

export type UseWorkConfigReturn = ReturnType<typeof useWorkConfig>;
