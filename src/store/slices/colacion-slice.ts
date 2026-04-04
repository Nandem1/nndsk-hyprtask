import { StoreSetter, StoreGetter, PublicActions } from "../types";

export interface ColacionState {
  isColacionOpen: boolean;
}

export const initialColacionState: ColacionState = {
  isColacionOpen: false,
};

type ColacionStore = ColacionState & ColacionActions;
type Setter = StoreSetter<ColacionStore>;
type Getter = StoreGetter<ColacionStore>;

export class ColacionActionImpl {
  readonly #get: Getter;
  readonly #set: Setter;

  constructor(set: Setter, get: Getter, _api?: unknown) {
    void _api;
    this.#set = set;
    this.#get = get;
  }

  openColacion = (): void => {
    this.#set({ isColacionOpen: true });
  };

  closeColacion = (): void => {
    this.#set({ isColacionOpen: false });
  };
}

export type ColacionActions = PublicActions<ColacionActionImpl>;

export const createColacionSlice = (set: Setter, get: Getter, api?: unknown) =>
  new ColacionActionImpl(set, get, api);
