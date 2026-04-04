import type { WorkSettings, WorkCalculation } from '../model/types';
import { timeToMinutes, calculateMinutesUntilTime } from '@shared/lib/time-utils';

export function calculateWorkHours(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);
  if (end < start) end += 24 * 60;
  return end - start;
}

export function calculateTimeUntilEnd(endTime: string): number {
  return calculateMinutesUntilTime(endTime);
}

export function calculateWorkData(settings: WorkSettings): WorkCalculation {
  const timeUntilEnd = calculateTimeUntilEnd(settings.endTime);
  const workHours = calculateWorkHours(settings.startTime, settings.endTime);

  return {
    endTime: settings.endTime,
    timeUntilEnd,
    workHours,
  };
}
