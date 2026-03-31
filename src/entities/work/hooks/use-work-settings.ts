"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkSettings, saveWorkSettings } from "../lib/storage";
import { calculateWorkData } from "../lib/calculations";
import { workKeys } from "../model/query-keys";

export { workKeys };

// Hook para obtener configuración de horario laboral
export function useWorkSettings() {
  return useQuery({
    queryKey: workKeys.settings(),
    queryFn: getWorkSettings,
    staleTime: Infinity,
  });
}

// Hook para guardar configuración de horario laboral
export function useSaveWorkSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveWorkSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workKeys.all });
    },
  });
}

// Hook para cálculos de horario laboral (derivado de settings)
export function useWorkCalculations() {
  const { data: settings } = useWorkSettings();

  return useQuery({
    queryKey: workKeys.calculations(settings || null),
    queryFn: () => {
      if (!settings) return null;
      return calculateWorkData(settings);
    },
    enabled: !!settings,
    staleTime: Infinity,
  });
}
