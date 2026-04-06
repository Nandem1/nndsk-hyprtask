"use client";

import { useState, useEffect } from "react";
import { useSleepSettings, useSaveSleepSettings, type SleepSettings } from "@/entities/sleep";
import { buildSettingsPayload } from "@/shared/lib/form";
import { defaultValues } from "../model/types";

export function useSleepConfig() {
  const { data: settings } = useSleepSettings();
  const saveSettingsMutation = useSaveSleepSettings();

  const [wakeupTime, setWakeupTime] = useState<string>(
    defaultValues.wakeupTime
  );
  const [desiredSleepHours, setDesiredSleepHours] = useState<number>(
    defaultValues.desiredSleepHours
  );
  const [sleepReminders, setSleepReminders] = useState<boolean>(
    defaultValues.sleepReminders
  );

  useEffect(() => {
    if (settings) {
      setWakeupTime(settings.wakeupTime);
      setDesiredSleepHours(settings.desiredSleepHours);
      setSleepReminders(settings.sleepReminders);
    }
  }, [settings]);

  const handleSave = () => {
    saveSettingsMutation.mutate(
      buildSettingsPayload<SleepSettings>(settings ?? undefined, { wakeupTime, desiredSleepHours, sleepReminders }),
    );
  };

  return {
    wakeupTime,
    setWakeupTime,
    desiredSleepHours,
    setDesiredSleepHours,
    sleepReminders,
    setSleepReminders,
    isSaving: saveSettingsMutation.isPending,
    handleSave,
  };
}

export type UseSleepConfigReturn = ReturnType<typeof useSleepConfig>;
