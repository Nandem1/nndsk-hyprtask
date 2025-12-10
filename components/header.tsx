'use client';

import Link from 'next/link';
import { Settings, CheckSquare, Briefcase, Bed } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatMinutesToReadable } from '@/lib/sleep/calculations';
import { useCurrentTask } from '@/hooks/use-tasks';
import { useSleepCalculations } from '@/hooks/use-sleep-settings';
import { useWorkCalculations } from '@/hooks/use-work-settings';
import { ThemeToggle } from '@/components/theme-toggle';
import { useThemeContext } from '@/components/theme-provider-context';

export function Header() {
  const { classes } = useThemeContext();
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
        {/* Logo estilo comfy */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            href="/tasks" 
            className="flex items-center gap-2 font-semibold"
          >
            <span className={`text-xl ${classes.textPrimary}`}>
              hyprtask
            </span>
          </Link>
        </motion.div>

        {/* Current Task y Sleep Timer - siempre visible */}
        <div className="flex items-center gap-4">
          {/* Current Task estilo comfy */}
          {currentTask && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-lg px-3 py-2 border border-border/20"
            >
              <div className="flex items-center gap-2">
                <CheckSquare className={`h-3.5 w-3.5 ${classes.textPrimary}`} />
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground">Current</div>
                  <div className={`text-sm font-medium ${classes.textPrimary} max-w-[150px] truncate`}>
                    {currentTask.title}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sleep Timer estilo comfy */}
          {sleepData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-lg px-3 py-2 border border-border/20"
            >
              <div className="flex items-center gap-3">
                <Bed className={`h-3.5 w-3.5 ${classes.textPrimary}`} />
                <div className="flex flex-col items-end">
                  <div className="text-xs text-muted-foreground">Sleep</div>
                  <div className={`text-sm font-medium ${classes.textPrimary}`}>
                    {sleepData.recommendedBedtime}
                  </div>
                </div>
                <div className="h-6 w-px bg-border/30" />
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground">Left</div>
                  <motion.div
                    key={sleepData.timeUntilBedtime}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-sm font-medium ${classes.textPrimary}`}
                  >
                    {formatMinutesToReadable(sleepData.timeUntilBedtime)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Work Timer estilo comfy */}
          {workData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-lg px-3 py-2 border border-border/20"
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`h-3.5 w-3.5 ${classes.textPrimary}`} />
                <div className="flex flex-col items-end">
                  <div className="text-xs text-muted-foreground">Work</div>
                  <div className={`text-sm font-medium ${classes.textPrimary}`}>
                    {workData.endTime}
                  </div>
                </div>
                <div className="h-6 w-px bg-border/30" />
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground">Left</div>
                  <motion.div
                    key={workData.timeUntilEnd}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-sm font-medium ${classes.textPrimary}`}
                  >
                    {formatMinutesToReadable(workData.timeUntilEnd)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Navegación estilo comfy */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/sleep/config"
              className="flex items-center gap-2 rounded-lg glass border border-border/20 px-3 py-2 text-sm font-medium transition-all hover:border-border/40"
            >
              <Settings className={`h-4 w-4 ${classes.textPrimary}`} />
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

