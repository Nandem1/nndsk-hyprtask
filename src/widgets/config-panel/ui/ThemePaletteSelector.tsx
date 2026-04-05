"use client";

import { cn } from "@/shared/lib/utils";
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
          <Palette className={cn("size-5", themeClasses.textPrimary)} />
          <span>Tema de color</span>
        </CardTitle>
        <CardDescription>
          Selecciona la paleta de colores de la aplicacion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Object.keys(THEMES) as ThemePalette[]).map((themeKey) => {
            const theme = THEMES[themeKey];
            const isSelected = palette === themeKey;

            return (
              <label
                key={themeKey}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors",
                  isSelected
                    ? getThemeBorder(themeKey)
                    : "border-border hover:border-border/80 bg-card",
                )}
              >
                <input
                  type="radio"
                  name="theme-palette"
                  value={themeKey}
                  checked={isSelected}
                  onChange={() => changePalette(themeKey)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "size-full aspect-video rounded-md",
                    "bg-gradient-to-r",
                    theme.colors.gradient,
                  )}
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{theme.emoji}</span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? themeClasses.textPrimary : "text-foreground",
                    )}
                  >
                    {theme.name}
                  </span>
                  {isSelected && (
                    <Check className={cn("size-3.5", themeClasses.textPrimary)} />
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
