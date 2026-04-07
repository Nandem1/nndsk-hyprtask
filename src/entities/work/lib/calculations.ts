import type { WorkSettings, WorkCalculation } from '../model/types';
import { timeToMinutes, calculateMinutesUntilTime } from '@shared/lib/time-utils';

export function calculateWorkHours(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);
  if (end < start) end += 24 * 60;
  return (end - start) / 60;
}

export function calculateTimeUntilEnd(endTime: string): number {
  return calculateMinutesUntilTime(endTime);
}

export function calculateWorkData(settings: WorkSettings): WorkCalculation {
  const timeUntilEnd = calculateTimeUntilEnd(settings.endTime);
  const timeUntilStart = calculateMinutesUntilTime(settings.startTime);
  const workHours = calculateWorkHours(settings.startTime, settings.endTime);

  // isWorking: ya empezó (timeUntilStart > 12h = ya pasó) y aún no terminó (timeUntilEnd < 12h)
  const startPassed = timeUntilStart > 12 * 60;
  const endNotPassed = timeUntilEnd <= 12 * 60;
  const isWorking = startPassed && endNotPassed;

  return {
    startTime: settings.startTime,
    endTime: settings.endTime,
    timeUntilStart: startPassed ? 0 : timeUntilStart,
    timeUntilEnd,
    workHours,
    isWorking,
  };
}
