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

export function HeaderClient() {
  const { data: currentTask } = useCurrentTask();
  const { data: sleepData } = useSleepCalculations();
  const { data: workData } = useWorkCalculations();
  const { data: workSettings } = useWorkSettings();
  const { openColacion } = useColacionActions();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
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
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm border-r border-border">
              <Bed className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Dormir:</span>
              <span className="font-medium">
                {sleepData.recommendedBedtime}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {formatMinutesToReadable(sleepData.timeUntilBedtime)}
              </span>
            </div>
          ) : null}

          {workData ? (
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm border-r border-border">
              <Briefcase className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Trabajo:</span>
              <span className="font-medium">{workData.endTime}</span>
            </div>
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
