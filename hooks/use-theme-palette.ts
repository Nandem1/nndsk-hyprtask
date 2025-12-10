'use client';

import { useState, useEffect } from 'react';
import { getThemePalette, saveThemePalette } from '@/lib/theme/storage';
import { THEMES } from '@/types/theme';
import type { ThemePalette, ThemeConfig } from '@/types/theme';

export function useThemePalette() {
  const [palette, setPalette] = useState<ThemePalette>('genshin');
  const [theme, setTheme] = useState<ThemeConfig>(THEMES['genshin']);

  useEffect(() => {
    const savedPalette = getThemePalette();
    setPalette(savedPalette);
    setTheme(THEMES[savedPalette]);
  }, []);

  const changePalette = (newPalette: ThemePalette) => {
    setPalette(newPalette);
    setTheme(THEMES[newPalette]);
    saveThemePalette(newPalette);
  };

  return {
    palette,
    theme,
    changePalette,
  };
}

