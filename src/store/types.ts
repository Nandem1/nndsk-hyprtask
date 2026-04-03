import type { StoreApi } from 'zustand';

/**
 * Tipo base para el setter del store
 * Compatible con Zustand y devtools middleware
 */
export type StoreSetter<T> = StoreApi<T>['setState'];

/**
 * Tipo base para el getter del store
 */
export type StoreGetter<T> = () => T;

/**
 * Helper para extraer solo las acciones públicas de una clase
 * Omite campos privados (#) y métodos internos
 */
export type PublicActions<T> = {
  [K in keyof T]: T[K];
};
