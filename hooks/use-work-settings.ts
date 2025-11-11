'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkSettings, saveWorkSettings } from '@/lib/work/storage';
import { calculateWorkData } from '@/lib/work/calculations';
import type { WorkSettings } from '@/types';

// Query keys
export const workKeys = {
  all: ['work'] as const,
  settings: () => [...workKeys.all, 'settings'] as const,
  calculations: (settings: WorkSettings | null) =>
    settings ? [...workKeys.all, 'calculations', settings.id] : [...workKeys.all, 'calculations'],
};

// Hook para obtener configuración de horario laboral
export function useWorkSettings() {
  return useQuery({
    queryKey: workKeys.settings(),
    queryFn: getWorkSettings,
    refetchInterval: 60000, // Refetch cada minuto
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
    refetchInterval: 60000, // Refetch cada minuto
  });
}

