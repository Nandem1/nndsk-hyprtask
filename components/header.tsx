'use client';

import Link from 'next/link';
import { Moon, Settings, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatMinutesToReadable } from '@/lib/sleep/calculations';
import { useCurrentTask } from '@/hooks/use-tasks';
import { useSleepCalculations } from '@/hooks/use-sleep-settings';
import { ThemeToggle } from '@/components/theme-toggle';
import { useThemeContext } from '@/components/theme-provider-context';

export function Header() {
  const { classes } = useThemeContext();
  const { data: currentTask } = useCurrentTask();
  const { data: sleepData } = useSleepCalculations();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40 shadow-lg shadow-black/5"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href="/tasks" 
            className="flex items-center gap-2 font-semibold"
          >
            <Moon className={`h-5 w-5 bg-gradient-to-r ${classes.iconGradient} bg-clip-text text-transparent`} />
            <span className={`hidden sm:inline bg-gradient-to-r ${classes.gradient} bg-clip-text text-transparent`}>
              HyprTasks
            </span>
          </Link>
        </motion.div>

        {/* Current Task y Sleep Timer - siempre visible */}
        <div className="flex items-center gap-4">
          {/* Current Task */}
          {currentTask && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 px-3 py-2 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10"
            >
              <CheckSquare className="h-4 w-4 text-green-400" />
              <div className="flex flex-col">
                <div className="text-xs text-muted-foreground/80">Tarea actual</div>
                <div className="text-sm font-semibold text-green-300 dark:text-green-200 max-w-[150px] truncate">
                  {currentTask.title}
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
              className={`flex items-center gap-3 rounded-xl bg-gradient-to-r ${classes.gradientBg} px-4 py-2 border ${classes.borderHover} backdrop-blur-sm shadow-lg ${classes.shadowHover}`}
            >
              <div className="flex flex-col items-end">
                <div className="text-xs text-muted-foreground/80">Dormir a las</div>
                <div className={`text-sm font-semibold ${classes.textPrimary} dark:${classes.textSecondary}`}>
                  {sleepData.recommendedBedtime}
                </div>
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="flex flex-col">
                <div className="text-xs text-muted-foreground/80">Tiempo restante</div>
                <motion.div
                  key={sleepData.timeUntilBedtime}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-sm font-bold bg-gradient-to-r ${classes.gradient} bg-clip-text text-transparent`}
                >
                  {formatMinutesToReadable(sleepData.timeUntilBedtime)}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="text-xs text-muted-foreground/60">
              Configura tu sueño
            </div>
          )}

          {/* Navegación */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/sleep/config"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/50 border border-transparent hover:border-border/50"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Sueño</span>
            </Link>
          </motion.div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}

