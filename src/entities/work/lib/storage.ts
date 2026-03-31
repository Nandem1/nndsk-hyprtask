// ABSTRACCIÓN DE ALMACENAMIENTO PARA HORARIO LABORAL

import type { WorkSettings } from "../model/types";

const STORAGE_KEYS = {
  SETTINGS: "hyprtodo_work_settings",
} as const;

// ============================================
// WORK SETTINGS
// ============================================

export async function getWorkSettings(): Promise<WorkSettings | null> {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) return null;

  return JSON.parse(stored) as WorkSettings;
}

export async function saveWorkSettings(settings: WorkSettings): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function deleteWorkSettings(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}
