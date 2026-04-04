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

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function calculateMinutesUntilTime(hhmm: string): number {
  const now = new Date();
  const { hours, minutes } = parseTimeString(hhmm);

  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target.getTime() - now.getTime()) / (1000 * 60));
}
