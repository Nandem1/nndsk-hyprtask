'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save } from 'lucide-react';
import { useSleepSettings, useSaveSleepSettings } from '@/hooks/use-sleep-settings';
import { useThemeContext } from '@/components/theme-provider-context';
import type { SleepSettings } from '@/types';

export function SleepConfig() {
  const { classes } = useThemeContext();
  const { data: settings } = useSleepSettings();
  const saveSettingsMutation = useSaveSleepSettings();
  
  const [wakeupTime, setWakeupTime] = useState<string>('07:00');
  const [desiredSleepHours, setDesiredSleepHours] = useState<number>(7);
  const [sleepReminders, setSleepReminders] = useState<boolean>(true);

  useEffect(() => {
    if (settings) {
      setWakeupTime(settings.wakeupTime);
      setDesiredSleepHours(settings.desiredSleepHours);
      setSleepReminders(settings.sleepReminders);
    }
  }, [settings]);

  const handleSave = () => {
    const newSettings: SleepSettings = {
      id: settings?.id || crypto.randomUUID(),
      wakeupTime,
      desiredSleepHours,
      sleepReminders,
      updatedAt: new Date().toISOString(),
      ...(settings?.createdAt && { createdAt: settings.createdAt }),
    };

    saveSettingsMutation.mutate(newSettings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className={`relative overflow-hidden border ${classes.border} bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm shadow-xl ${classes.shadow} transition-all duration-300 hover:shadow-2xl ${classes.shadowHover} hover:${classes.borderHover}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${classes.gradientBgSubtle} opacity-50`} />
        <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuración de Sueño
        </CardTitle>
        <CardDescription>
          Define tus horarios ideales de descanso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        <div className="space-y-2">
          <Label htmlFor="wakeup">Hora de alarma</Label>
          <Input
            id="wakeup"
            type="time"
            value={wakeupTime}
            onChange={(e) => setWakeupTime(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            A qué hora quieres despertar
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sleepHours">Horas de sueño deseadas</Label>
          <Input
            id="sleepHours"
            type="number"
            min="6"
            max="10"
            value={desiredSleepHours}
            onChange={(e) => setDesiredSleepHours(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Cuántas horas de sueño quieres (7 u 8 recomendado)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="reminders"
            checked={sleepReminders}
            onChange={(e) => setSleepReminders(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="reminders" className="cursor-pointer">
            Activar recordatorios inteligentes
          </Label>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSave}
            disabled={saveSettingsMutation.isPending}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveSettingsMutation.isPending ? 'Guardando...' : 'Guardar configuración'}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

