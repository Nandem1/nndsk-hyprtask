"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSleepSettings,
  saveSleepSettings,
  getSleepLogs,
} from "../lib/storage";
import { calculateSleepData } from "../lib/calculations";
import { sleepKeys } from "../model/query-keys";

export { sleepKeys };

// Hook para obtener configuración de sueño
export function useSleepSettings() {
  return useQuery({
    queryKey: sleepKeys.settings(),
    queryFn: getSleepSettings,
    refetchInterval: 60000, // Refetch cada minuto
  });
}

// Hook para guardar configuración de sueño
export function useSaveSleepSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSleepSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sleepKeys.all });
    },
  });
}

// Hook para cálculos de sueño (derivado de settings)
export function useSleepCalculations() {
  const { data: settings } = useSleepSettings();

  return useQuery({
    queryKey: sleepKeys.calculations(settings || null),
    queryFn: () => {
      if (!settings) return null;
      return calculateSleepData(settings);
    },
    enabled: !!settings,
    refetchInterval: 60000, // Refetch cada minuto
  });
}

// Hook para obtener logs de sueño (TanStack Query, no useEffect directo)
export function useSleepLogs() {
  return useQuery({
    queryKey: sleepKeys.logs(),
    queryFn: getSleepLogs,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
