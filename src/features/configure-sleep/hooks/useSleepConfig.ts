"use client";

import { useSleepSettings, useSaveSleepSettings } from "@/entities/sleep";
import { createSettingsFormHook } from "@/shared/hooks/use-settings-form";
import { defaultValues } from "../model/types";

const useSleepForm = createSettingsFormHook({
  useSettings: useSleepSettings,
  useSaveSettings: useSaveSleepSettings,
  defaults: defaultValues,
});

export function useSleepConfig() {
  return useSleepForm();
}

export type UseSleepConfigReturn = ReturnType<typeof useSleepConfig>;
