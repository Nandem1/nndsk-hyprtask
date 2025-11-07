'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSleepSettings, saveSleepSettings } from '@/lib/sleep/storage';
import { calculateSleepData } from '@/lib/sleep/calculations';
import type { SleepSettings } from '@/types';

// Query keys
export const sleepKeys = {
  all: ['sleep'] as const,
  settings: () => [...sleepKeys.all, 'settings'] as const,
  calculations: (settings: SleepSettings | null) =>
    settings ? [...sleepKeys.all, 'calculations', settings.id] : [...sleepKeys.all, 'calculations'],
};

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

