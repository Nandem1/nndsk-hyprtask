"use client";

import { useState, useEffect } from "react";
import { useSleepSettings, useSaveSleepSettings } from "@/entities/sleep";
import { defaultValues, type SleepConfigFormData } from "../model/types";

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
    const newSettings = {
      id: settings?.id || crypto.randomUUID(),
      wakeupTime,
      desiredSleepHours,
      sleepReminders,
      updatedAt: new Date().toISOString(),
      ...(settings?.createdAt && { createdAt: settings.createdAt }),
    };
    saveSettingsMutation.mutate(newSettings);
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
