import { StoreSetter, StoreGetter, PublicActions } from "../types";
import type { ThemePalette, ExtendedThemeClasses } from "@/shared/types/theme";
import { getExtendedThemeClasses } from "@/shared/config/theme/utils";

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_PALETTE: ThemePalette = "genshin";

// Single source of truth: derive defaults from the canonical theme function
export const DEFAULT_THEME_CLASSES: ExtendedThemeClasses = getExtendedThemeClasses(DEFAULT_PALETTE);

// ============================================================================
// State
// ============================================================================

export interface ThemeState {
  palette: ThemePalette;
  themeClasses: ExtendedThemeClasses;
}

export function computeThemeClasses(palette: ThemePalette): ExtendedThemeClasses {
  try {
    return getExtendedThemeClasses(palette);
  } catch {
    return DEFAULT_THEME_CLASSES;
  }
}

export const initialThemeState: ThemeState = {
  palette: DEFAULT_PALETTE,
  themeClasses: DEFAULT_THEME_CLASSES,
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
