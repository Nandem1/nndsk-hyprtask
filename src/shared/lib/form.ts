interface BaseSettings {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Construye el payload de guardado para configuraciones con id y timestamps */
export function buildSettingsPayload<T extends BaseSettings>(
  existing: T | undefined,
  fields: Omit<T, "id" | "createdAt" | "updatedAt">,
): T {
  return {
    id: existing?.id ?? crypto.randomUUID(),
    ...(existing?.createdAt ? { createdAt: existing.createdAt } : {}),
    updatedAt: new Date().toISOString(),
    ...fields,
  } as T;
}

/**
 * Valor centinela para campos Select opcionales.
 * Representa "sin selección" en el DOM (los Select no admiten undefined como value).
 */
export const SENTINEL_NONE = "__none__" as const;
export type SentinelNone = typeof SENTINEL_NONE;

/** Convierte un valor de Select al valor real: "__none__" → undefined */
export function fromSentinel<T extends string>(value: string): T | undefined {
  return value === SENTINEL_NONE ? undefined : (value as T);
}

/** Convierte un valor real al value del Select: undefined → "__none__" */
export function toSentinel<T extends string>(value: T | undefined): T | SentinelNone {
  return value ?? SENTINEL_NONE;
}
