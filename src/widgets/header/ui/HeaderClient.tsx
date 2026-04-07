"use client";

import Link from "next/link";
import { Settings, CheckSquare, Briefcase, Bed, UtensilsCrossed } from "lucide-react";
import { useCurrentTask } from "@/entities/task";
import { useSleepCalculations } from "@/entities/sleep";
import { useWorkCalculations, useWorkSettings } from "@/entities/work";
import { formatMinutesToReadable } from "@/shared/lib/time-utils";
import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/theme";
import { useColacionActions } from "@/store/hooks";
import { HeaderPill } from "./HeaderPill";

export function HeaderClient() {
  const { data: currentTask } = useCurrentTask();
  const { data: sleepData } = useSleepCalculations();
  const { data: workData } = useWorkCalculations();
  const { data: workSettings } = useWorkSettings();
  const { openColacion } = useColacionActions();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 items-center justify-between px-4">
        <Link
          href="/tasks"
          className="flex items-center gap-2 font-semibold text-lg tracking-tight"
        >
          <span className="text-foreground">hyprtask</span>
        </Link>

        <div className="flex-1 flex justify-center px-8">
          {currentTask ? (
            <div className="flex items-center gap-3 text-sm">
              <CheckSquare className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">En progreso:</span>
              <span className="font-medium text-foreground truncate max-w-[300px]">
                {currentTask.title}
              </span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              Sin tarea activa
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {sleepData ? (
            <Link href="/sleep">
              <HeaderPill
                icon={<Bed className="size-4 text-muted-foreground" />}
                label="Dormir:"
                value={sleepData.recommendedBedtime}
                secondary={formatMinutesToReadable(sleepData.timeUntilBedtime)}
              />
            </Link>
          ) : null}

          {workData ? (
            <Link href="/work">
              <HeaderPill
                icon={<Briefcase className="size-4 text-muted-foreground" />}
                label="Trabajo:"
                value={workData.isWorking ? workData.endTime : workData.startTime}
                secondary={formatMinutesToReadable(
                  workData.isWorking ? workData.timeUntilEnd : workData.timeUntilStart,
                )}
              />
            </Link>
          ) : null}

          {workSettings ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={openColacion}
              className="size-9"
              title="Iniciar colacion"
            >
              <UtensilsCrossed className="size-4" />
            </Button>
          ) : null}

          <Button variant="ghost" size="icon" asChild className="size-9">
            <Link href="/config">
              <Settings />
              <span className="sr-only">Configuracion</span>
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
