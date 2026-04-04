"use client";

import { useMemo } from "react";
import type { SleepLog } from "../model/types";
import { timeToMinutes } from "@shared/lib/time-utils";

export function useSleepStats(logs: SleepLog[]) {
  return useMemo(() => {
    const last7 = logs.slice(0, 7);

    const logsWithHours = last7.filter(
      (log) => log.actualBedtime && log.actualWakeup,
    );

    let averageHours = 0;
    if (logsWithHours.length > 0) {
      const totalHours = logsWithHours.reduce((acc, log) => {
        const bedTotal = timeToMinutes(log.actualBedtime!);
        let wakeTotal = timeToMinutes(log.actualWakeup!);
        if (wakeTotal < bedTotal) wakeTotal += 24 * 60;
        return acc + (wakeTotal - bedTotal) / 60;
      }, 0);
      averageHours = totalHours / logsWithHours.length;
    }

    const logsWithQuality = last7.filter((log) => log.qualityRating !== null);
    let averageQuality = 0;
    if (logsWithQuality.length > 0) {
      averageQuality =
        logsWithQuality.reduce((acc, log) => acc + (log.qualityRating ?? 0), 0) /
        logsWithQuality.length;
    }

    return { logs: last7, averageHours, averageQuality };
  }, [logs]);
}
