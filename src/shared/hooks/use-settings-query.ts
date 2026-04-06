"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { asyncWrap } from "@shared/lib/utils";
import type { QueryKey } from "@tanstack/react-query";

interface SettingsHooksConfig<TSettings, TData> {
  keys: {
    all: QueryKey;
    settings: () => QueryKey;
    calculations: (settings: TSettings | null) => QueryKey;
  };
  getSettings: () => TSettings | null;
  saveSettings: (s: TSettings) => void;
  calculateData: (s: TSettings) => TData | null;
}

export function createSettingsHooks<TSettings, TData>(
  config: SettingsHooksConfig<TSettings, TData>,
) {
  function useSettings() {
    return useQuery({
      queryKey: config.keys.settings(),
      queryFn: config.getSettings,
      staleTime: Infinity,
    });
  }

  function useSaveSettings() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: asyncWrap(config.saveSettings),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: config.keys.all });
      },
    });
  }

  function useCalculations() {
    const { data: settings } = useSettings();
    return useQuery({
      queryKey: config.keys.calculations(settings ?? null),
      queryFn: () => {
        if (!settings) return null;
        return config.calculateData(settings);
      },
      enabled: !!settings,
      staleTime: Infinity,
    });
  }

  return { useSettings, useSaveSettings, useCalculations };
}
