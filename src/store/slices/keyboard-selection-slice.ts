import { StoreSetter, StoreGetter } from "../types";

export interface KeyboardSelectionState {
  keyboardSelectedId: string | null;
}

export const initialKeyboardSelectionState: KeyboardSelectionState = {
  keyboardSelectedId: null,
};

type KeyboardSelectionStore = KeyboardSelectionState & KeyboardSelectionActions;
type Setter = StoreSetter<KeyboardSelectionStore>;
type Getter = StoreGetter<KeyboardSelectionStore>;

export class KeyboardSelectionActionImpl {
  readonly #get: Getter;
  readonly #set: Setter;

  constructor(set: Setter, get: Getter) {
    this.#set = set;
    this.#get = get;
  }

  setKeyboardSelectedId = (id: string | null): void => {
    this.#set({ keyboardSelectedId: id });
  };

  clearKeyboardSelection = (): void => {
    this.#set({ keyboardSelectedId: null });
  };
}

export type KeyboardSelectionActions = {
  setKeyboardSelectedId: (id: string | null) => void;
  clearKeyboardSelection: () => void;
};

export const createKeyboardSelectionSlice = (set: Setter, get: Getter) =>
  new KeyboardSelectionActionImpl(set, get);
