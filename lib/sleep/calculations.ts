// LÓGICA DE CÁLCULOS DE SUEÑO
// Funciones puras, sin dependencias externas

import type { SleepSettings, SleepCalculation, SleepAlert, AlertLevel } from '@/types';

/**
 * Calcula tiempo hasta hora de dormir en minutos
 */
export function calculateTimeUntilBedtime(bedtime: string): number {
  const now = new Date();
  const [hours, minutes] = bedtime.split(':').map(Number);
  
  const bedtimeToday = new Date();
  bedtimeToday.setHours(hours, minutes, 0, 0);
  
  // Si ya pasó la hora de dormir hoy, calcular para mañana
  if (bedtimeToday <= now) {
    bedtimeToday.setDate(bedtimeToday.getDate() + 1);
  }
  
  return Math.floor((bedtimeToday.getTime() - now.getTime()) / (1000 * 60));
}

/**
 * Calcula hora recomendada para dormir basada en la alarma y horas deseadas
 * Considera ciclos de 90 minutos para despertar renovado
 */
export function calculateRecommendedBedtime(
  wakeupTime: string,
  desiredSleepHours: number
): string {
  const [wakeHours, wakeMinutes] = wakeupTime.split(':').map(Number);
  const wakeTotal = wakeHours * 60 + wakeMinutes;
  
  // Calcular ciclos de 90 minutos (redondea al ciclo más cercano)
  const cycles = Math.round((desiredSleepHours * 60) / 90);
  const adjustedCycles = Math.max(4, cycles); // Mínimo 4 ciclos (6 horas)
  
  // Tiempo de sueño en minutos (basado en ciclos completos)
  const sleepMinutes = adjustedCycles * 90;
  
  // Calcular hora de dormir (hacia atrás desde despertar)
  let bedTotal = wakeTotal - sleepMinutes;
  
  // Si es negativo, es del día anterior
  if (bedTotal < 0) {
    bedTotal += 24 * 60;
  }
  
  const bedHours = Math.floor(bedTotal / 60);
  const bedMins = bedTotal % 60;
  
  return `${String(bedHours).padStart(2, '0')}:${String(bedMins).padStart(2, '0')}`;
}

/**
 * Genera cálculo completo de sueño
 */
export function calculateSleepData(settings: SleepSettings): SleepCalculation {
  // Calcular hora recomendada para dormir
  const recommendedBedtime = calculateRecommendedBedtime(
    settings.wakeupTime,
    settings.desiredSleepHours
  );
  
  // Calcular tiempo hasta la hora de dormir
  const timeUntilBedtime = calculateTimeUntilBedtime(recommendedBedtime);
  
  // Calcular ciclos de sueño
  const sleepCycles = Math.round((settings.desiredSleepHours * 60) / 90);
  const adjustedCycles = Math.max(4, sleepCycles);
  
  // Horas totales de sueño (basadas en ciclos completos)
  const totalSleepHours = (adjustedCycles * 90) / 60;
  
  return {
    recommendedBedtime,
    timeUntilBedtime,
    sleepCycles: adjustedCycles,
    totalSleepHours,
  };
}

/**
 * Genera alertas inteligentes según tiempo restante
 */
export function generateSleepAlert(
  timeUntilBedtime: number,
  remindersEnabled: boolean
): SleepAlert {
  if (!remindersEnabled) {
    return {
      level: 'none',
      message: '',
      timeRemaining: timeUntilBedtime,
    };
  }
  
  const hours = Math.floor(timeUntilBedtime / 60);
  const minutes = timeUntilBedtime % 60;
  
  // 30 minutos antes: crítico
  if (timeUntilBedtime <= 30) {
    return {
      level: 'critical',
      message: 'Apaga pantallas y prepárate para dormir',
      timeRemaining: timeUntilBedtime,
    };
  }
  
  // 1 hora antes: advertencia
  if (timeUntilBedtime <= 60) {
    return {
      level: 'warning',
      message: 'Comienza tu rutina de relajación',
      timeRemaining: timeUntilBedtime,
    };
  }
  
  // 2 horas antes: advertencia suave
  if (timeUntilBedtime <= 120) {
    return {
      level: 'warning',
      message: 'Termina actividades intensas',
      timeRemaining: timeUntilBedtime,
    };
  }
  
  return {
    level: 'none',
    message: '',
    timeRemaining: timeUntilBedtime,
  };
}

/**
 * Formatea minutos a string HH:mm
 */
export function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Formatea minutos a string legible (ej: "2h 30m")
 */
export function formatMinutesToReadable(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

