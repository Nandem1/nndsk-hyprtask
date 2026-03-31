"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Configuración de retry con backoff exponencial
const createRetryDelay = (attemptIndex: number) => {
  return Math.min(1000 * 2 ** attemptIndex, 30000);
};

// Configuración global de QueryClient
export const queryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minuto
      gcTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      throwOnError: false,
      retry: 3,
      retryDelay: createRetryDelay,
      // Placeholder para carga instantánea
      placeholderData: (previousData: unknown) => previousData,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryConfig));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
