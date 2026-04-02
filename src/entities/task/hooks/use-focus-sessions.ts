import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "hyprtask-focus-sessions";

export interface FocusSessionData {
  count: number;
  lastDate: string; // ISO date string YYYY-MM-DD
  totalMinutes: number;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getInitialData(): FocusSessionData {
  if (typeof window === "undefined") {
    return { count: 0, lastDate: getToday(), totalMinutes: 0 };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: FocusSessionData = JSON.parse(stored);
      const today = getToday();

      // Reset if it's a new day
      if (data.lastDate !== today) {
        return { count: 0, lastDate: today, totalMinutes: 0 };
      }

      return data;
    }
  } catch {
    // Invalid data, start fresh
  }

  return { count: 0, lastDate: getToday(), totalMinutes: 0 };
}

export function useFocusSessions() {
  const [sessions, setSessions] = useState<FocusSessionData>(getInitialData);

  // Persist to localStorage whenever sessions change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const incrementSession = useCallback((minutes: number = 25) => {
    setSessions((prev) => ({
      count: prev.count + 1,
      lastDate: getToday(),
      totalMinutes: prev.totalMinutes + minutes,
    }));
  }, []);

  const resetDaily = useCallback(() => {
    const today = getToday();
    setSessions((prev) => {
      if (prev.lastDate !== today) {
        return { count: 0, lastDate: today, totalMinutes: 0 };
      }
      return prev;
    });
  }, []);

  const getStats = useCallback(() => {
    return {
      sessionsToday: sessions.count,
      totalMinutesToday: sessions.totalMinutes,
      averageSessionLength:
        sessions.count > 0 ? Math.round(sessions.totalMinutes / sessions.count) : 0,
    };
  }, [sessions]);

  return {
    sessions,
    incrementSession,
    resetDaily,
    getStats,
  };
}
