"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getSleepSettings,
  saveSleepSettings,
  getSleepLogs,
} from "../lib/storage";
import { calculateSleepData } from "../lib/calculations";
import { sleepKeys } from "../model/query-keys";
import { createSettingsHooks } from "@shared/hooks/use-settings-query";

export { sleepKeys };

const sleepHooks = createSettingsHooks({
  keys: sleepKeys,
  getSettings: getSleepSettings,
  saveSettings: saveSleepSettings,
  calculateData: calculateSleepData,
});

export const useSleepSettings = sleepHooks.useSettings;
export const useSaveSleepSettings = sleepHooks.useSaveSettings;
export const useSleepCalculations = sleepHooks.useCalculations;

// Hook para obtener logs de sueño (específico de sleep, sin equivalente en work)
export function useSleepLogs() {
  return useQuery({
    queryKey: sleepKeys.logs(),
    queryFn: getSleepLogs,
    staleTime: Infinity,
  });
}
