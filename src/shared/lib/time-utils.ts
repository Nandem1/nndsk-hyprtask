/**
 * Parsea un string "HH:mm" a sus componentes numéricos
 */
export function parseTimeString(hhmm: string): { hours: number; minutes: number } {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Convierte un string "HH:mm" a minutos totales desde medianoche
 */
export function timeToMinutes(hhmm: string): number {
  const { hours, minutes } = parseTimeString(hhmm);
  return hours * 60 + minutes;
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
