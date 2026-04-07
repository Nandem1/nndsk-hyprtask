import { StoreSetter, StoreGetter } from "../types";

export interface UIPreferencesState {
  isColacionOpen: boolean;
  animatedEmotes: boolean;
  isSidebarCollapsed: boolean;
  isShortcutsPanelCollapsed: boolean;
  isLeaderActive: boolean;
}

export const initialUIPreferencesState: UIPreferencesState = {
  isColacionOpen: false,
  animatedEmotes: true,
  isSidebarCollapsed: false,
  isShortcutsPanelCollapsed: false,
  isLeaderActive: false,
};

type UIPreferencesStore = UIPreferencesState & UIPreferencesActions;
type Setter = StoreSetter<UIPreferencesStore>;
type Getter = StoreGetter<UIPreferencesStore>;

export class UIPreferencesActionImpl {
  readonly #get: Getter;
  readonly #set: Setter;

  constructor(set: Setter, get: Getter) {
    this.#set = set;
    this.#get = get;
  }

  openColacion = (): void => {
    this.#set({ isColacionOpen: true });
  };

  closeColacion = (): void => {
    this.#set({ isColacionOpen: false });
  };

  setAnimatedEmotes = (animated: boolean): void => {
    this.#set({ animatedEmotes: animated });
  };

  toggleSidebar = (): void => {
    this.#set({ isSidebarCollapsed: !this.#get().isSidebarCollapsed });
  };

  toggleShortcutsPanel = (): void => {
    this.#set({ isShortcutsPanelCollapsed: !this.#get().isShortcutsPanelCollapsed });
  };

  setLeaderActive = (active: boolean): void => {
    this.#set({ isLeaderActive: active });
  };
}

export type UIPreferencesActions = {
  openColacion: () => void;
  closeColacion: () => void;
  setAnimatedEmotes: (animated: boolean) => void;
  toggleSidebar: () => void;
  toggleShortcutsPanel: () => void;
  setLeaderActive: (active: boolean) => void;
};

export const createUIPreferencesSlice = (set: Setter, get: Getter) =>
  new UIPreferencesActionImpl(set, get);
