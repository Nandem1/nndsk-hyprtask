// ALMACENAMIENTO DE TEMA
// localStorage por ahora, preparado para migrar a Supabase

import type { ThemePalette } from '@/types/theme';

const STORAGE_KEY = 'hyprtodo_theme_palette';

export function getThemePalette(): ThemePalette {
  // TODO: Migrar a Supabase cuando esté listo
  // return await supabase.from('user_settings').select('theme_palette').single();
  
  if (typeof window === 'undefined') {
    return 'blue-cyan-teal'; // Default
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return 'blue-cyan-teal';
  
  return stored as ThemePalette;
}

export function saveThemePalette(palette: ThemePalette): void {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('user_settings').upsert({ theme_palette: palette });
  
  localStorage.setItem(STORAGE_KEY, palette);
}

