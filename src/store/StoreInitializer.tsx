"use client";

import { useEffect } from "react";
import { useStore } from "./index";

/**
 * Componente que maneja la hidratación del store.
 *
 * Con el middleware `persist` de Zustand, la hidratación ocurre automáticamente
 * en el cliente. Este componente asegura que se complete antes de renderizar
 * y maneja cualquier sincronización adicional necesaria.
 */
export function StoreInitializer() {
  const hasHydrated = useStore((state) => state._hasHydrated);

  useEffect(() => {
    // Asegurar que la hidratación se complete
    // El middleware persist ya maneja la carga de localStorage
    if (!hasHydrated && typeof window !== "undefined") {
      // Force rehydration if needed
      useStore.persist.rehydrate();
    }
  }, [hasHydrated]);

  // Este componente no renderiza nada
  // Opcionalmente podríamos mostrar un loader mientras hidrata
  return null;
}
