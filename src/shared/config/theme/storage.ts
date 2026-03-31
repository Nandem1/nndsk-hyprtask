// ALMACENAMIENTO DE TEMA

import type { ThemePalette } from "@/shared/types/theme";

const STORAGE_KEY = "hyprtodo_theme_palette";

export function getThemePalette(): ThemePalette {
  if (typeof window === "undefined") {
    return "genshin"; // Default
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return "genshin";

  // Validar que el tema almacenado sea válido
  const validThemes: ThemePalette[] = [
    "genshin",
    "zenless",
    "wuthering",
    "osu",
    "mario",
  ];
  if (stored && validThemes.includes(stored as ThemePalette)) {
    return stored as ThemePalette;
  }

  return "genshin";
}

export function saveThemePalette(palette: ThemePalette): void {
  localStorage.setItem(STORAGE_KEY, palette);
}
