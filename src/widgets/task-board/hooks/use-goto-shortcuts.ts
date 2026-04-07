"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { useLeaderKey } from "./use-leader-key";
import { useUIPreferencesActions } from "@/store/hooks";

interface UseGotoShortcutsOptions {
  enabled?: boolean;
}

interface UseGotoShortcutsResult {
  leaderActive: boolean;
}

export function useGotoShortcuts({
  enabled = true,
}: UseGotoShortcutsOptions = {}): UseGotoShortcutsResult {
  const router = useRouter();
  const { leaderActive, resetLeader } = useLeaderKey({ leaderKey: "g", enabled });
  const { setLeaderActive } = useUIPreferencesActions();

  useEffect(() => {
    setLeaderActive(leaderActive);
  }, [leaderActive, setLeaderActive]);

  useHotkeys(
    "h",
    () => { resetLeader(); router.push("/tasks"); },
    { enabled: leaderActive },
    [leaderActive, resetLeader],
  );

  useHotkeys(
    "s",
    () => { resetLeader(); router.push("/sleep"); },
    { enabled: leaderActive },
    [leaderActive, resetLeader],
  );

  useHotkeys(
    "w",
    () => { resetLeader(); router.push("/work"); },
    { enabled: leaderActive },
    [leaderActive, resetLeader],
  );

  useHotkeys(
    "c",
    () => { resetLeader(); router.push("/config"); },
    { enabled: leaderActive },
    [leaderActive, resetLeader],
  );

  return { leaderActive };
}
