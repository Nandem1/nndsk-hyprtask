// ABSTRACCIÓN DE ALMACENAMIENTO PARA HORARIO LABORAL

import type { WorkSettings } from "../model/types";

const STORAGE_KEYS = {
  SETTINGS: "hyprtodo_work_settings",
} as const;

// ============================================
// WORK SETTINGS
// ============================================

export async function getWorkSettings(): Promise<WorkSettings | null> {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) return null;

  return JSON.parse(stored) as WorkSettings;
}

export async function saveWorkSettings(settings: WorkSettings): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function deleteWorkSettings(): Promise<void> {
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}
