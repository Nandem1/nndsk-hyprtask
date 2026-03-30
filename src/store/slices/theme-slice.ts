import { StoreSetter, StoreGetter, PublicActions } from "../types";
import type { ThemePalette } from "@/shared/types/theme";
import { getThemeClassesString } from "@/shared/config/theme/utils";
import type { ThemeClasses } from "@/shared/config/theme/utils";

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_PALETTE: ThemePalette = "genshin";

// Default theme classes for SSR safety
export const DEFAULT_THEME_CLASSES: ThemeClasses = {
  gradient: "from-blue-300 via-cyan-300 to-teal-300",
  gradientBg: "from-blue-400/10 via-cyan-400/10 to-teal-400/10",
  gradientBgSubtle: "from-blue-400/5 via-cyan-400/5 to-teal-400/5",
  border: "border-blue-400/20",
  borderHover: "border-blue-400/40",
  shadow: "shadow-blue-400/10",
  shadowHover: "shadow-blue-400/15",
  textPrimary: "text-blue-200",
  textSecondary: "text-cyan-200",
  textAccent: "text-teal-200",
  iconGradient: "from-blue-300 to-cyan-300",
  glow: "shadow-blue-300/20",
  glowStrong: "shadow-blue-300/30",
};

// ============================================================================
// State
// ============================================================================

export interface ThemeState {
  palette: ThemePalette;
  // Store computed values in state for SSR compatibility
  themeClasses: ThemeClasses;
  isDarkPalette: boolean;
}

export function computeThemeClasses(palette: ThemePalette): ThemeClasses {
  try {
    return getThemeClassesString(palette);
  } catch {
    return DEFAULT_THEME_CLASSES;
  }
}

export function computeIsDarkPalette(palette: ThemePalette): boolean {
  return ["midnight", "forest", "coffee"].includes(palette);
}

export const initialThemeState: ThemeState = {
  palette: DEFAULT_PALETTE,
  themeClasses: DEFAULT_THEME_CLASSES,
  isDarkPalette: false,
};

// ============================================================================
// Actions Class
// ============================================================================

type ThemeStore = ThemeState & ThemeActions;
type Setter = StoreSetter<ThemeStore>;
type Getter = StoreGetter<ThemeStore>;

export class ThemeActionImpl {
  private readonly _get: Getter;
  private readonly _set: Setter;

  constructor(set: Setter, get: Getter, _api?: unknown) {
    void _api;
    this._set = set;
    this._get = get;
  }

  // --------------------------------------------------------------------------
  // Internal Helpers
  // --------------------------------------------------------------------------

  private _updateThemeState = (palette: ThemePalette): void => {
    this._set({
      palette,
      themeClasses: computeThemeClasses(palette),
      isDarkPalette: computeIsDarkPalette(palette),
    });
  };

  // --------------------------------------------------------------------------
  // Public Actions
  // --------------------------------------------------------------------------

  /**
   * Cambia la paleta de colores del tema
   * Nota: La persistencia se maneja via middleware persist
   */
  changePalette = (palette: ThemePalette): void => {
    this._updateThemeState(palette);
  };

  /**
   * Action to hydrate theme from storage (called by persist middleware)
   */
  hydrateFromStorage = (palette: ThemePalette): void => {
    this._updateThemeState(palette);
  };
}

// ============================================================================
// Slice Factory
// ============================================================================

export type ThemeActions = PublicActions<ThemeActionImpl>;

export const createThemeSlice = (set: Setter, get: Getter, api?: unknown) =>
  new ThemeActionImpl(set, get, api);
