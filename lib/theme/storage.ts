// ALMACENAMIENTO DE TEMA
// localStorage por ahora, preparado para migrar a Supabase

import type { ThemePalette } from '@/types/theme';

const STORAGE_KEY = 'hyprtodo_theme_palette';

export function getThemePalette(): ThemePalette {
  // TODO: Migrar a Supabase cuando esté listo
  // return await supabase.from('user_settings').select('theme_palette').single();
  
  if (typeof window === 'undefined') {
    return 'genshin'; // Default
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return 'genshin';
  
  // Validar que el tema almacenado sea válido
  const validThemes: ThemePalette[] = ['genshin', 'zenless', 'wuthering', 'osu', 'mario'];
  if (stored && validThemes.includes(stored as ThemePalette)) {
    return stored as ThemePalette;
  }
  
  return 'genshin';
}

export function saveThemePalette(palette: ThemePalette): void {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('user_settings').upsert({ theme_palette: palette });
  
  localStorage.setItem(STORAGE_KEY, palette);
}

