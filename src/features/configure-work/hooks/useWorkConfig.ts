"use client";

import { useWorkSettings, useSaveWorkSettings } from "@/entities/work";
import { createSettingsFormHook } from "@/shared/hooks/use-settings-form";
import { defaultValues } from "../model/types";

const useWorkForm = createSettingsFormHook({
  useSettings: useWorkSettings,
  useSaveSettings: useSaveWorkSettings,
  defaults: defaultValues,
});

export function useWorkConfig() {
  return useWorkForm();
}

export type UseWorkConfigReturn = ReturnType<typeof useWorkConfig>;
