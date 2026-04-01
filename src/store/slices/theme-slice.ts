import { StoreSetter, StoreGetter, PublicActions } from "../types";
import type { ThemePalette, ExtendedThemeClasses } from "@/shared/types/theme";
import { getExtendedThemeClasses } from "@/shared/config/theme/utils";

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_PALETTE: ThemePalette = "genshin";

// Default theme classes for SSR safety - Extended with new properties
export const DEFAULT_THEME_CLASSES: ExtendedThemeClasses = {
  // Base classes
  gradient: "from-blue-500 to-cyan-500",
  gradientBg: "bg-blue-500/10",
  gradientBgSubtle: "bg-blue-500/5",
  border: "border-blue-500/30",
  borderHover: "border-blue-500/50",
  shadow: "shadow-blue-500/5",
  shadowHover: "shadow-blue-500/10",
  textPrimary: "text-blue-400",
  textSecondary: "text-cyan-400",
  textAccent: "text-teal-400",
  iconGradient: "text-blue-400",
  glow: "shadow-blue-500/10",
  glowStrong: "shadow-blue-500/20",
  // Extended classes
  glassBg: "bg-blue-500/5 backdrop-blur-xl",
  glassBorder: "border-blue-400/20",
  glassBorderStrong: "border-blue-400/40",
  depthShadow: "shadow-blue-500/10 shadow-2xl",
  depthShadowHover: "shadow-blue-500/20 shadow-2xl",
  animatedGradient: "bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20",
  particleColor: "#60A5FA",
  shimmer: "bg-gradient-to-r from-transparent via-blue-400/20 to-transparent",
  glowPulse: "shadow-blue-500/30 animate-pulse-glow",
};

// ============================================================================
// State
// ============================================================================

export interface ThemeState {
  palette: ThemePalette;
  // Store computed values in state for SSR compatibility
  themeClasses: ExtendedThemeClasses;
  isDarkPalette: boolean;
}

export function computeThemeClasses(palette: ThemePalette): ExtendedThemeClasses {
  try {
    return getExtendedThemeClasses(palette);
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
  readonly #get: Getter;
  readonly #set: Setter;

  constructor(set: Setter, get: Getter, _api?: unknown) {
    void _api;
    this.#set = set;
    this.#get = get;
  }

  // --------------------------------------------------------------------------
  // Internal Helpers
  // --------------------------------------------------------------------------

  #updateThemeState = (palette: ThemePalette): void => {
    this.#set({
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
    this.#updateThemeState(palette);
  };
}

// ============================================================================
// Slice Factory
// ============================================================================

export type ThemeActions = PublicActions<ThemeActionImpl>;

export const createThemeSlice = (set: Setter, get: Getter, api?: unknown) =>
  new ThemeActionImpl(set, get, api);
