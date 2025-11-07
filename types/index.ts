// TIPOS PARA SISTEMA DE SUEÑO
// Preparados para migrar a Supabase sin cambios

export interface SleepSettings {
  id: string;
  userId?: string; // Para Supabase, opcional en localStorage
  wakeupTime: string; // Formato HH:mm - Hora de alarma
  desiredSleepHours: number; // Horas de sueño deseadas (7 u 8)
  sleepReminders: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SleepLog {
  id: string;
  userId?: string; // Para Supabase, opcional en localStorage
  date: string; // Formato YYYY-MM-DD
  actualBedtime: string | null; // Formato HH:mm
  actualWakeup: string | null; // Formato HH:mm
  qualityRating: number | null; // 1-5
  notes: string | null;
  createdAt?: string;
}

// Tipos para cálculos
export interface SleepCalculation {
  recommendedBedtime: string; // HH:mm - Hora recomendada para dormir
  timeUntilBedtime: number; // minutos hasta la hora de dormir
  sleepCycles: number; // ciclos de 90 minutos
  totalSleepHours: number; // horas totales de sueño
}

// Tipos para alertas
export type AlertLevel = 'none' | 'warning' | 'critical';
export interface SleepAlert {
  level: AlertLevel;
  message: string;
  timeRemaining: number; // minutos
}

