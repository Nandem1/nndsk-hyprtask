'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeContext } from '@/components/theme-provider-context';
import { THEMES } from '@/types/theme';
import type { ThemePalette } from '@/types/theme';
import { Palette } from 'lucide-react';

export function ThemePaletteSelector() {
  const { palette, changePalette, classes } = useThemeContext();

  const getThemeBorder = (themeKey: ThemePalette) => {
    const borders: Record<ThemePalette, string> = {
      'genshin': 'border-blue-400/30 bg-blue-400/10',
      'zenless': 'border-purple-400/30 bg-purple-400/10',
      'wuthering': 'border-teal-400/30 bg-teal-400/10',
      'osu': 'border-pink-400/30 bg-pink-400/10',
      'mario': 'border-red-400/30 bg-red-400/10',
    };
    return borders[themeKey];
  };

  return (
    <Card className={`terminal-border ${classes.border} scanlines`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <Palette className={`h-5 w-5 ${classes.textPrimary}`} />
          <span className={classes.textPrimary}>theme_palette</span>
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          $ select your vibe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          {(Object.keys(THEMES) as ThemePalette[]).map((themeKey) => {
            const theme = THEMES[themeKey];
            const isSelected = palette === themeKey;

            return (
              <label
                key={themeKey}
                className={`relative flex items-center gap-3 rounded border-2 p-4 cursor-pointer transition-all font-mono ${
                  isSelected
                    ? `${getThemeBorder(themeKey)} ${classes.shadowHover} ${classes.glow}`
                    : `${classes.border} hover:${classes.borderHover} bg-background/50`
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
                <div className="flex-1 flex items-center gap-3">
                  <span className={isSelected ? classes.textPrimary : 'text-muted-foreground'}>
                    {isSelected ? '>' : ' '}
                  </span>
                  <div
                    className={`w-12 h-12 rounded border-2 ${classes.border} bg-linear-to-r ${theme.colors.gradient} shrink-0`}
                  />
                  <div className="flex-1">
                    <div className={`font-bold ${isSelected ? classes.textPrimary : 'text-foreground'}`}>
                      {theme.emoji} {theme.name}
                    </div>
                    <div className={`text-xs font-mono ${isSelected ? classes.textSecondary : 'text-muted-foreground'}`}>
                      {theme.colors.primary} → {theme.colors.secondary} → {theme.colors.accent}
                    </div>
                  </div>
                  {isSelected && (
                    <div className={`w-3 h-3 rounded border-2 ${classes.borderHover} ${classes.gradientBg} flex items-center justify-center`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${classes.textPrimary}`} />
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

