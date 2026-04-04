// Utilidades genéricas de localStorage
// Todas las funciones son síncronas: localStorage es síncrono.

const isServer = typeof window === "undefined";

/** Lee un item de localStorage y lo deserializa. Retorna null si no existe o en SSR. */
export function storageGet<T>(key: string): T | null {
  if (isServer) return null;
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  return JSON.parse(stored) as T;
}

/** Lee un array de localStorage. Retorna [] si no existe o en SSR. */
export function storageGetList<T>(key: string): T[] {
  if (isServer) return [];
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  return JSON.parse(stored) as T[];
}

/** Serializa y guarda un valor en localStorage. No-op en SSR. */
export function storageSet<T>(key: string, value: T): void {
  if (isServer) return;
  localStorage.setItem(key, JSON.stringify(value));
}

/** Elimina un item de localStorage. No-op en SSR. */
export function storageRemove(key: string): void {
  if (isServer) return;
  localStorage.removeItem(key);
}

/**
 * Envuelve una función síncrona para devolver Promise<void>,
 * necesario para pasarla como `mutationFn` en TanStack Query.
 */
export function asyncWrap<T>(fn: (v: T) => void): (v: T) => Promise<void> {
  return async (v) => { fn(v); };
}

/**
 * Upsert genérico sobre un array: si existe un item con el mismo id lo reemplaza,
 * si no lo agrega al final. Retorna un nuevo array (no muta el original).
 */
export function upsertItem<T extends { id: string }>(items: T[], item: T): T[] {
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    return [...items.slice(0, index), item, ...items.slice(index + 1)];
  }
  return [...items, item];
}
