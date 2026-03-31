"use client";

import Link from "next/link";
import { Settings, CheckSquare, Briefcase, Bed } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeState } from "@/store/hooks";
import { ThemeToggle } from "@/shared/theme";
import { useCurrentTask } from "@/entities/task";
import { useSleepCalculations } from "@/entities/sleep";
import { useWorkCalculations } from "@/entities/work";
import { formatMinutesToReadable } from "@/shared/lib/time-utils";

export function HeaderClient() {
  const { themeClasses } = useThemeState();
  const { data: currentTask } = useCurrentTask();
  const { data: sleepData } = useSleepCalculations();
  const { data: workData } = useWorkCalculations();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-50 w-full border-b border-border/20 glass-dark"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/tasks" className="flex items-center gap-2 font-semibold">
            <span className={`text-xl ${themeClasses.textPrimary}`}>
              hyprtask
            </span>
          </Link>
        </motion.div>

        {/* Current Task y Sleep Timer */}
        <div className="flex items-center gap-4">
          {/* Current Task */}
          {currentTask && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-lg px-3 py-2 border border-border/20"
            >
              <div className="flex items-center gap-2">
                <CheckSquare
                  className={`h-3.5 w-3.5 ${themeClasses.textPrimary}`}
                />
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground">Actual</div>
                  <div
                    className={`text-sm font-medium ${themeClasses.textPrimary} max-w-[150px] truncate`}
                  >
                    {currentTask.title}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sleep Timer */}
          {sleepData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-lg px-3 py-2 border border-border/20"
            >
              <div className="flex items-center gap-3">
                <Bed className={`h-3.5 w-3.5 ${themeClasses.textPrimary}`} />
                <div className="flex flex-col items-end">
                  <div className="text-xs text-muted-foreground">Sueno</div>
                  <div
                    className={`text-sm font-medium ${themeClasses.textPrimary}`}
                  >
                    {sleepData.recommendedBedtime}
                  </div>
                </div>
                <div className="h-6 w-px bg-border/30" />
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground">Restante</div>
                  <motion.div
                    key={sleepData.timeUntilBedtime}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-sm font-medium ${themeClasses.textPrimary}`}
                  >
                    {formatMinutesToReadable(sleepData.timeUntilBedtime)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Work Timer */}
          {workData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-lg px-3 py-2 border border-border/20"
            >
              <div className="flex items-center gap-3">
                <Briefcase
                  className={`h-3.5 w-3.5 ${themeClasses.textPrimary}`}
                />
                <div className="flex flex-col items-end">
                  <div className="text-xs text-muted-foreground">Trabajo</div>
                  <div
                    className={`text-sm font-medium ${themeClasses.textPrimary}`}
                  >
                    {workData.endTime}
                  </div>
                </div>
                <div className="h-6 w-px bg-border/30" />
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground">Restante</div>
                  <motion.div
                    key={workData.timeUntilEnd}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-sm font-medium ${themeClasses.textPrimary}`}
                  >
                    {formatMinutesToReadable(workData.timeUntilEnd)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Config */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/sleep/config"
              className="flex items-center gap-2 rounded-lg glass border border-border/20 px-3 py-2 text-sm font-medium transition-all hover:border-border/40"
            >
              <Settings className={`h-4 w-4 ${themeClasses.textPrimary}`} />
              <span className="hidden sm:inline">Config</span>
            </Link>
          </motion.div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
