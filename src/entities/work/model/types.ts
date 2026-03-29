// TIPOS PARA HORARIO LABORAL
// Preparados para migrar a Supabase sin cambios

export interface WorkSettings {
  id: string;
  userId?: string; // Para Supabase, opcional en localStorage
  startTime: string; // Formato HH:mm - Hora de entrada
  endTime: string; // Formato HH:mm - Hora de salida
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para cálculos de trabajo
export interface WorkCalculation {
  endTime: string; // HH:mm - Hora de salida
  timeUntilEnd: number; // minutos hasta la hora de salida
  workHours: number; // horas totales de trabajo
}
