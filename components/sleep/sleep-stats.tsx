'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { getSleepLogs } from '@/lib/sleep/storage';
import { useThemeContext } from '@/components/theme-provider-context';
import type { SleepLog } from '@/types';

export function SleepStats() {
  const { classes } = useThemeContext();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [averageHours, setAverageHours] = useState<number>(0);
  const [averageQuality, setAverageQuality] = useState<number>(0);

  useEffect(() => {
    const loadLogs = async () => {
      const sleepLogs = await getSleepLogs();
      // Últimos 7 días
      const last7Days = sleepLogs.slice(0, 7);
      setLogs(last7Days);

      // Calcular promedios
      const logsWithHours = last7Days.filter(
        (log) => log.actualBedtime && log.actualWakeup
      );

      if (logsWithHours.length > 0) {
        const totalHours = logsWithHours.reduce((acc, log) => {
          if (!log.actualBedtime || !log.actualWakeup) return acc;
          
          const [bedHours, bedMins] = log.actualBedtime.split(':').map(Number);
          const [wakeHours, wakeMins] = log.actualWakeup.split(':').map(Number);
          
          let bedTotal = bedHours * 60 + bedMins;
          let wakeTotal = wakeHours * 60 + wakeMins;
          
          if (wakeTotal < bedTotal) {
            wakeTotal += 24 * 60;
          }
          
          return acc + (wakeTotal - bedTotal) / 60;
        }, 0);
        
        setAverageHours(totalHours / logsWithHours.length);

        const logsWithQuality = last7Days.filter(
          (log) => log.qualityRating !== null
        );
        
        if (logsWithQuality.length > 0) {
          const totalQuality = logsWithQuality.reduce(
            (acc, log) => acc + (log.qualityRating || 0),
            0
          );
          setAverageQuality(totalQuality / logsWithQuality.length);
        }
      }
    };

    loadLogs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
    >
      <Card className={`relative overflow-hidden border ${classes.border} bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm shadow-xl ${classes.shadow} transition-all duration-300 hover:shadow-2xl ${classes.shadowHover} hover:${classes.borderHover}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${classes.gradientBgSubtle} opacity-50`} />
        <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Estadísticas Semanales
        </CardTitle>
        <CardDescription>
          Resumen de tus últimos 7 días
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay registros aún</p>
            <p className="text-sm mt-2">
              Registra tu sueño para ver estadísticas
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-semibold">
                  {averageHours > 0 ? averageHours.toFixed(1) : '--'}h
                </div>
                <div className="text-xs text-muted-foreground">
                  Promedio de sueño
                </div>
              </div>
              <div>
                <div className="text-2xl font-semibold">
                  {averageQuality > 0 ? averageQuality.toFixed(1) : '--'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Calidad promedio
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4" />
                Registros recientes
              </div>
              <div className="space-y-2">
                {logs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{new Date(log.date).toLocaleDateString('es-ES', { 
                      weekday: 'short', 
                      day: 'numeric' 
                    })}</span>
                    <span className="text-muted-foreground">
                      {log.actualBedtime && log.actualWakeup
                        ? `${log.actualBedtime} - ${log.actualWakeup}`
                        : 'Sin registro'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}

