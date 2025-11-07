'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useThemeContext } from '@/components/theme-provider-context';
import { THEMES } from '@/types/theme';
import type { ThemePalette } from '@/types/theme';
import { Palette } from 'lucide-react';

export function ThemePaletteSelector() {
  const { palette, changePalette } = useThemeContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Paleta de Colores
        </CardTitle>
        <CardDescription>
          Elige tu paleta de colores favorita
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {(Object.keys(THEMES) as ThemePalette[]).map((themeKey) => {
            const theme = THEMES[themeKey];
            const isSelected = palette === themeKey;

            return (
              <label
                key={themeKey}
                className={`relative flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                  isSelected
                    ? themeKey === 'blue-cyan-teal' 
                      ? 'border-blue-500 bg-blue-500/10'
                      : themeKey === 'pink-red-orange'
                      ? 'border-pink-500 bg-pink-500/10'
                      : themeKey === 'teal-cyan-blue'
                      ? 'border-teal-500 bg-teal-500/10'
                      : 'border-blue-500 bg-blue-500/10'
                    : 'border-border hover:border-blue-500/50 hover:bg-accent/50'
                }`}
              >
                <input
                  type="radio"
                  name="theme-palette"
                  value={themeKey}
                  checked={isSelected}
                  onChange={() => changePalette(themeKey)}
                  className="sr-only"
                />
                <div className={`flex-1 flex items-center gap-3`}>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${theme.colors.gradient} flex-shrink-0`}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{theme.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {theme.colors.primary} → {theme.colors.secondary} → {theme.colors.accent}
                    </div>
                  </div>
                  {isSelected && (
                    <div className={`w-5 h-5 rounded-full ${
                      themeKey === 'blue-cyan-teal' 
                        ? 'bg-blue-500'
                        : themeKey === 'pink-red-orange'
                        ? 'bg-pink-500'
                        : themeKey === 'teal-cyan-blue'
                        ? 'bg-teal-500'
                        : 'bg-blue-500'
                    } flex items-center justify-center`}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

