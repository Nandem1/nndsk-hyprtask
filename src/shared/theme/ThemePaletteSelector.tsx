"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useTheme } from "@/store/hooks";
import { THEMES } from "@/shared/types/theme";
import type { ThemePalette } from "@/shared/types/theme";
import { Palette, Check } from "lucide-react";

export function ThemePaletteSelector() {
  const { palette, changePalette, themeClasses } = useTheme();

  const getThemeBorder = (themeKey: ThemePalette) => {
    const borders: Record<ThemePalette, string> = {
      genshin: "border-blue-500/30 bg-blue-500/10",
      zenless: "border-purple-500/30 bg-purple-500/10",
      wuthering: "border-teal-500/30 bg-teal-500/10",
      osu: "border-pink-500/30 bg-pink-500/10",
      mario: "border-red-500/30 bg-red-500/10",
    };
    return borders[themeKey];
  };

  return (
    <Card className={themeClasses.border}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className={`h-5 w-5 ${themeClasses.textPrimary}`} />
          <span>Tema de color</span>
        </CardTitle>
        <CardDescription>
          Selecciona la paleta de colores de la aplicacion
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
                className={`relative flex items-center gap-3 rounded-md border p-4 cursor-pointer transition-colors ${
                  isSelected
                    ? `${getThemeBorder(themeKey)}`
                    : `border-border hover:border-border/80 bg-card`
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
                  <div
                    className={`w-10 h-10 rounded-md border ${themeClasses.border} bg-gradient-to-r ${theme.colors.gradient} shrink-0`}
                  />
                  <div className="flex-1">
                    <div
                      className={`font-medium ${isSelected ? themeClasses.textPrimary : "text-foreground"}`}
                    >
                      {theme.emoji} {theme.name}
                    </div>
                    <div className={`text-xs text-muted-foreground`}>
                      {theme.colors.primary} → {theme.colors.secondary} →{" "}
                      {theme.colors.accent}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className={`w-5 h-5 ${themeClasses.textPrimary}`} />
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
