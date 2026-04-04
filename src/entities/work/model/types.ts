// TIPOS PARA HORARIO LABORAL
// Preparados para migrar a Supabase sin cambios

export interface WorkSettings {
  id: string;
  userId?: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para cálculos de trabajo
export interface WorkCalculation {
  endTime: string; // HH:mm - Hora de salida
  timeUntilEnd: number; // minutos hasta la hora de salida
  workHours: number; // horas totales de trabajo
}
