// ABSTRACCIÓN DE ALMACENAMIENTO

import type { SleepSettings, SleepLog } from "../model/types";

const STORAGE_KEYS = {
  SETTINGS: "hyprtodo_sleep_settings",
  LOGS: "hyprtodo_sleep_logs",
} as const;

// ============================================
// SLEEP SETTINGS
// ============================================

export async function getSleepSettings(): Promise<SleepSettings | null> {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) return null;

  return JSON.parse(stored) as SleepSettings;
}

export async function saveSleepSettings(
  settings: SleepSettings,
): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function deleteSleepSettings(): Promise<void> {
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}

// ============================================
// SLEEP LOGS
// ============================================

export async function getSleepLogs(): Promise<SleepLog[]> {
  const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!stored) return [];

  return JSON.parse(stored) as SleepLog[];
}

export async function getSleepLogByDate(
  date: string,
): Promise<SleepLog | null> {
  const logs = await getSleepLogs();
  return logs.find((log) => log.date === date) || null;
}

export async function saveSleepLog(log: SleepLog): Promise<void> {
  const logs = await getSleepLogs();
  const existingIndex = logs.findIndex((l) => l.id === log.id);

  if (existingIndex >= 0) {
    logs[existingIndex] = log;
  } else {
    logs.push(log);
  }

  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

export async function deleteSleepLog(id: string): Promise<void> {
  const logs = await getSleepLogs();
  const filtered = logs.filter((log) => log.id !== id);
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(filtered));
}
