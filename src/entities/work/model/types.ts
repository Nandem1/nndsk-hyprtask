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
  startTime: string; // HH:mm - Hora de entrada
  endTime: string; // HH:mm - Hora de salida
  timeUntilStart: number; // minutos hasta la hora de entrada (0 si ya empezó)
  timeUntilEnd: number; // minutos hasta la hora de salida
  workHours: number; // horas totales de trabajo
  isWorking: boolean; // true si la hora actual está entre entrada y salida
}
