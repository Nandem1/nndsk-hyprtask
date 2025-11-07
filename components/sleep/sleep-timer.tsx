'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Moon } from 'lucide-react';
import { useSleepSettings, useSleepCalculations } from '@/hooks/use-sleep-settings';
import { generateSleepAlert, formatMinutesToReadable } from '@/lib/sleep/calculations';
import { useThemeContext } from '@/components/theme-provider-context';

export function SleepTimer() {
  const { classes } = useThemeContext();
  const { data: settings } = useSleepSettings();
  const { data: sleepData } = useSleepCalculations();

  const alert = useMemo(() => {
    if (!sleepData || !settings) return null;
    return generateSleepAlert(sleepData.timeUntilBedtime, settings.sleepReminders);
  }, [sleepData, settings]);

  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Control de Sueño
          </CardTitle>
          <CardDescription>
            Configura tus horarios de sueño para comenzar
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className={`relative overflow-hidden border-2 ${classes.border} bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm shadow-xl ${classes.shadow} transition-all duration-300 hover:shadow-2xl ${classes.shadowHover} hover:${classes.borderHover}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${classes.gradientBgSubtle} opacity-50`} />
        <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Hora de dormir recomendada
        </CardTitle>
        <CardDescription>
          Alarma: {settings.wakeupTime} | {settings.desiredSleepHours}h de sueño
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {/* Hora recomendada */}
        <div className="text-center">
          <motion.div
            key={sleepData?.recommendedBedtime}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`text-5xl font-bold tracking-tight bg-gradient-to-r ${classes.gradient} bg-clip-text text-transparent`}
          >
            {sleepData?.recommendedBedtime || '--:--'}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground mt-2"
          >
            Debes dormir a las <span className={`font-semibold ${classes.textPrimary}`}>{sleepData?.recommendedBedtime || '--:--'}</span> para despertar a las <span className={`font-semibold ${classes.textSecondary}`}>{settings.wakeupTime}</span>
          </motion.div>
        </div>

        {/* Tiempo restante */}
        <div className="text-center pt-2 border-t">
          <div className="text-lg font-semibold">
            {sleepData ? formatMinutesToReadable(sleepData.timeUntilBedtime) : '--'} restantes
          </div>
          <div className="text-xs text-muted-foreground">
            Tiempo hasta la hora de dormir
          </div>
        </div>

        {/* Alerta */}
        {alert && alert.level !== 'none' && (
          <div
            className={`rounded-lg p-3 text-sm ${
              alert.level === 'critical'
                ? 'bg-destructive/10 text-destructive border border-destructive/20'
                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Información de sueño */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-2xl font-semibold">
              {sleepData ? sleepData.totalSleepHours.toFixed(1) : '0.0'}h
            </div>
            <div className="text-xs text-muted-foreground">
              Horas de sueño
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold">
              {sleepData?.sleepCycles || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Ciclos de 90min
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

