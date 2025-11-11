// LÓGICA DE CÁLCULOS DE HORARIO LABORAL
// Funciones puras, sin dependencias externas

import type { WorkSettings, WorkCalculation } from '@/types';

/**
 * Calcula tiempo hasta hora de salida en minutos
 */
export function calculateTimeUntilEnd(endTime: string): number {
  const now = new Date();
  const [hours, minutes] = endTime.split(':').map(Number);
  
  const endToday = new Date();
  endToday.setHours(hours, minutes, 0, 0);
  
  // Si ya pasó la hora de salida hoy, calcular para mañana
  if (endToday <= now) {
    endToday.setDate(endToday.getDate() + 1);
  }
  
  return Math.floor((endToday.getTime() - now.getTime()) / (1000 * 60));
}

/**
 * Calcula horas de trabajo entre entrada y salida
 */
export function calculateWorkHours(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotal = startHours * 60 + startMinutes;
  let endTotal = endHours * 60 + endMinutes;
  
  // Si la hora de salida es menor que la de entrada, es del día siguiente
  if (endTotal < startTotal) {
    endTotal += 24 * 60;
  }
  
  const workMinutes = endTotal - startTotal;
  return workMinutes / 60;
}

/**
 * Genera cálculo completo de horario laboral
 */
export function calculateWorkData(settings: WorkSettings): WorkCalculation {
  // Calcular tiempo hasta la hora de salida
  const timeUntilEnd = calculateTimeUntilEnd(settings.endTime);
  
  // Calcular horas de trabajo
  const workHours = calculateWorkHours(settings.startTime, settings.endTime);
  
  return {
    endTime: settings.endTime,
    timeUntilEnd,
    workHours,
  };
}

