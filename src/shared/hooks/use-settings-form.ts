"use client";

import { useState, useEffect } from "react";
import { buildSettingsPayload } from "@shared/lib/form";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

interface BaseSettings {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

type SettingsFields<T extends BaseSettings> = Omit<T, "id" | "createdAt" | "updatedAt">;

interface SettingsFormConfig<TSettings extends BaseSettings> {
  useSettings: () => UseQueryResult<TSettings | null | undefined>;
  useSaveSettings: () => UseMutationResult<void, unknown, TSettings>;
  defaults: SettingsFields<TSettings>;
}

export function createSettingsFormHook<TSettings extends BaseSettings>(
  config: SettingsFormConfig<TSettings>,
) {
  return function useSettingsForm() {
    const { data: settings } = config.useSettings();
    const saveSettingsMutation = config.useSaveSettings();
    const [fields, setFields] = useState<SettingsFields<TSettings>>(config.defaults);

    useEffect(() => {
      if (settings) {
        const { id: _id, createdAt: _ca, updatedAt: _ua, ...rest } = settings as BaseSettings & SettingsFields<TSettings>;
        void _id; void _ca; void _ua;
        const defined = Object.fromEntries(
          Object.entries(rest).filter(([, v]) => v !== undefined),
        );
        setFields({ ...config.defaults, ...defined } as SettingsFields<TSettings>);
      }
    }, [settings]);

    const setField = <K extends keyof SettingsFields<TSettings>>(
      key: K,
      value: SettingsFields<TSettings>[K],
    ) => setFields((prev) => ({ ...prev, [key]: value }));

    const handleSave = () => {
      saveSettingsMutation.mutate(
        buildSettingsPayload<TSettings>(settings ?? undefined, fields),
      );
    };

    return {
      fields,
      setField,
      isSaving: saveSettingsMutation.isPending,
      handleSave,
    };
  };
}
