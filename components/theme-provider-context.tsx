'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useThemePalette } from '@/hooks/use-theme-palette';
import { getThemeClassesString } from '@/lib/theme/utils';
import type { ThemePalette } from '@/types/theme';

interface ThemeContextType {
  palette: ThemePalette;
  classes: ReturnType<typeof getThemeClassesString>;
  changePalette: (palette: ThemePalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderContext({ children }: { children: ReactNode }) {
  const { palette, changePalette } = useThemePalette();
  const classes = getThemeClassesString(palette);

  return (
    <ThemeContext.Provider value={{ palette, classes, changePalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProviderContext');
  }
  return context;
}

