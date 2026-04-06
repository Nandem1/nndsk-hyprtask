"use client";

import { getWorkSettings, saveWorkSettings } from "../lib/storage";
import { calculateWorkData } from "../lib/calculations";
import { workKeys } from "../model/query-keys";
import { createSettingsHooks } from "@shared/hooks/use-settings-query";

export { workKeys };

const workHooks = createSettingsHooks({
  keys: workKeys,
  getSettings: getWorkSettings,
  saveSettings: saveWorkSettings,
  calculateData: calculateWorkData,
});

export const useWorkSettings = workHooks.useSettings;
export const useSaveWorkSettings = workHooks.useSaveSettings;
export const useWorkCalculations = workHooks.useCalculations;
