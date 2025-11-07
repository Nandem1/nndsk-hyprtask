// ABSTRACCIÓN DE ALMACENAMIENTO
// localStorage por ahora, preparado para migrar a Supabase
// Cambiar solo esta capa cuando migremos

import type { SleepSettings, SleepLog } from '@/types';

const STORAGE_KEYS = {
  SETTINGS: 'hyprtodo_sleep_settings',
  LOGS: 'hyprtodo_sleep_logs',
} as const;

// ============================================
// SLEEP SETTINGS
// ============================================

export async function getSleepSettings(): Promise<SleepSettings | null> {
  // TODO: Migrar a Supabase cuando esté listo
  // return await supabase.from('sleep_settings').select('*').single();
  
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) return null;
  
  return JSON.parse(stored) as SleepSettings;
}

export async function saveSleepSettings(settings: SleepSettings): Promise<void> {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('sleep_settings').upsert(settings);
  
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function deleteSleepSettings(): Promise<void> {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('sleep_settings').delete().eq('id', id);
  
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}

// ============================================
// SLEEP LOGS
// ============================================

export async function getSleepLogs(): Promise<SleepLog[]> {
  // TODO: Migrar a Supabase cuando esté listo
  // return await supabase.from('sleep_logs').select('*').order('date', { ascending: false });
  
  const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!stored) return [];
  
  return JSON.parse(stored) as SleepLog[];
}

export async function getSleepLogByDate(date: string): Promise<SleepLog | null> {
  const logs = await getSleepLogs();
  return logs.find(log => log.date === date) || null;
}

export async function saveSleepLog(log: SleepLog): Promise<void> {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('sleep_logs').upsert(log);
  
  const logs = await getSleepLogs();
  const existingIndex = logs.findIndex(l => l.id === log.id);
  
  if (existingIndex >= 0) {
    logs[existingIndex] = log;
  } else {
    logs.push(log);
  }
  
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

export async function deleteSleepLog(id: string): Promise<void> {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('sleep_logs').delete().eq('id', id);
  
  const logs = await getSleepLogs();
  const filtered = logs.filter(log => log.id !== id);
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(filtered));
}

