"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { getFocusSessions, incrementFocusSessions } from "../lib/storage";
import { taskKeys } from "../model/query-keys";

export function useFocusSessions() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: taskKeys.focusSessions(),
    queryFn: getFocusSessions,
    staleTime: Infinity,
  });

  const incrementMutation = useMutation({
    mutationFn: async (minutes: number) => incrementFocusSessions(minutes),
    onSuccess: (data) => {
      qc.setQueryData(taskKeys.focusSessions(), data);
    },
  });

  const data = query.data ?? { count: 0, lastDate: "", totalMinutes: 0 };

  const stats = useMemo(
    () => ({
      sessionsToday: data.count,
      totalMinutesToday: data.totalMinutes,
      averageSessionLength:
        data.count > 0 ? Math.round(data.totalMinutes / data.count) : 0,
    }),
    [data.count, data.totalMinutes],
  );

  return {
    sessions: data,
    incrementSession: incrementMutation.mutate,
    getStats: () => stats,
  };
}
