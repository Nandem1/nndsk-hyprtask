// ABSTRACCIÓN DE ALMACENAMIENTO PARA HORARIO LABORAL
// localStorage por ahora, preparado para migrar a Supabase
// Cambiar solo esta capa cuando migremos

import type { WorkSettings } from '@/types';

const STORAGE_KEYS = {
  SETTINGS: 'hyprtodo_work_settings',
} as const;

// ============================================
// WORK SETTINGS
// ============================================

export async function getWorkSettings(): Promise<WorkSettings | null> {
  // TODO: Migrar a Supabase cuando esté listo
  // return await supabase.from('work_settings').select('*').single();
  
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) return null;
  
  return JSON.parse(stored) as WorkSettings;
}

export async function saveWorkSettings(settings: WorkSettings): Promise<void> {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('work_settings').upsert(settings);
  
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function deleteWorkSettings(): Promise<void> {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('work_settings').delete().eq('id', id);
  
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}

