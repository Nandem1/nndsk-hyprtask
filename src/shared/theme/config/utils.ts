import type { ThemePalette, ExtendedThemeClasses } from "@/shared/types/theme";
import { THEME_BASE_CLASSES, THEME_EXTENDED_CLASSES } from "@/shared/types/theme";

export function getExtendedThemeClasses(palette: ThemePalette): ExtendedThemeClasses {
  return {
    ...THEME_BASE_CLASSES[palette],
    ...THEME_EXTENDED_CLASSES[palette],
  };
}

export function getThemeClassesString(palette: ThemePalette) {
  return THEME_BASE_CLASSES[palette];
}

// Tipo de retorno para las clases del tema (legacy)
export type ThemeClasses = ReturnType<typeof getThemeClassesString>;
