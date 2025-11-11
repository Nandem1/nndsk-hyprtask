'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Briefcase } from 'lucide-react';
import { useWorkSettings, useWorkCalculations } from '@/hooks/use-work-settings';
import { formatMinutesToReadable } from '@/lib/sleep/calculations';
import { useThemeContext } from '@/components/theme-provider-context';

export function WorkTimer() {
  const { classes } = useThemeContext();
  const { data: settings } = useWorkSettings();
  const { data: workData } = useWorkCalculations();

  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Horario Laboral
          </CardTitle>
          <CardDescription>
            Configura tus horarios de trabajo para comenzar
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
            Hora de salida
          </CardTitle>
          <CardDescription>
            Entrada: {settings.startTime} | Salida: {settings.endTime}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          {/* Hora de salida */}
          <div className="text-center">
            <motion.div
              key={workData?.endTime}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`text-5xl font-bold tracking-tight bg-gradient-to-r ${classes.gradient} bg-clip-text text-transparent`}
            >
              {workData?.endTime || '--:--'}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground mt-2"
            >
              Sales a las <span className={`font-semibold ${classes.textPrimary}`}>{workData?.endTime || '--:--'}</span>
            </motion.div>
          </div>

          {/* Tiempo restante */}
          <div className="text-center pt-2 border-t">
            <div className="text-lg font-semibold">
              {workData ? formatMinutesToReadable(workData.timeUntilEnd) : '--'} restantes
            </div>
            <div className="text-xs text-muted-foreground">
              Tiempo hasta la hora de salida
            </div>
          </div>

          {/* Información de trabajo */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-2xl font-semibold">
                {workData ? workData.workHours.toFixed(1) : '0.0'}h
              </div>
              <div className="text-xs text-muted-foreground">
                Horas de trabajo
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {settings.startTime}
              </div>
              <div className="text-xs text-muted-foreground">
                Hora de entrada
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

