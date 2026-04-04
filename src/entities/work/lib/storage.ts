// ABSTRACCIÓN DE ALMACENAMIENTO PARA HORARIO LABORAL

import type { WorkSettings } from "../model/types";
import { storageGet, storageSet, storageRemove } from "@shared/lib/storage";

const STORAGE_KEYS = {
  SETTINGS: "hyprtodo_work_settings",
} as const;

// ============================================
// WORK SETTINGS
// ============================================

export function getWorkSettings(): WorkSettings | null {
  return storageGet<WorkSettings>(STORAGE_KEYS.SETTINGS);
}

export function saveWorkSettings(settings: WorkSettings): void {
  storageSet(STORAGE_KEYS.SETTINGS, settings);
}

export function deleteWorkSettings(): void {
  storageRemove(STORAGE_KEYS.SETTINGS);
}
