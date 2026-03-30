"use client";

import { useState, useEffect } from "react";
import {
  getThemePalette,
  saveThemePalette,
} from "@/shared/config/theme/storage";
import { THEMES } from "@/shared/types/theme";
import type { ThemePalette, ThemeConfig } from "@/shared/types/theme";

export function useThemePalette() {
  const [palette, setPalette] = useState<ThemePalette>("genshin");
  const [theme, setTheme] = useState<ThemeConfig>(THEMES["genshin"]);

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
