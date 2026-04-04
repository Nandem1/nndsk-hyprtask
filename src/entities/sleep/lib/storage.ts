// ABSTRACCIÓN DE ALMACENAMIENTO

import type { SleepSettings, SleepLog } from "../model/types";
import {
  storageGet,
  storageGetList,
  storageSet,
  storageRemove,
} from "@shared/lib/storage";
import { upsertItem } from "@shared/lib/array";

const STORAGE_KEYS = {
  SETTINGS: "hyprtodo_sleep_settings",
  LOGS: "hyprtodo_sleep_logs",
} as const;

// ============================================
// SLEEP SETTINGS
// ============================================

export function getSleepSettings(): SleepSettings | null {
  return storageGet<SleepSettings>(STORAGE_KEYS.SETTINGS);
}

export function saveSleepSettings(settings: SleepSettings): void {
  storageSet(STORAGE_KEYS.SETTINGS, settings);
}

export function deleteSleepSettings(): void {
  storageRemove(STORAGE_KEYS.SETTINGS);
}

// ============================================
// SLEEP LOGS
// ============================================

export function getSleepLogs(): SleepLog[] {
  return storageGetList<SleepLog>(STORAGE_KEYS.LOGS);
}

export function getSleepLogByDate(date: string): SleepLog | null {
  const logs = getSleepLogs();
  return logs.find((log) => log.date === date) ?? null;
}

export function saveSleepLog(log: SleepLog): void {
  storageSet(STORAGE_KEYS.LOGS, upsertItem(getSleepLogs(), log));
}

export function deleteSleepLog(id: string): void {
  storageSet(STORAGE_KEYS.LOGS, getSleepLogs().filter((log) => log.id !== id));
}
