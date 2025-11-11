'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Moon, Briefcase } from 'lucide-react';
import { useSleepSettings, useSaveSleepSettings } from '@/hooks/use-sleep-settings';
import { useWorkSettings, useSaveWorkSettings } from '@/hooks/use-work-settings';
import { useThemeContext } from '@/components/theme-provider-context';
import type { SleepSettings, WorkSettings } from '@/types';

export function GeneralConfig() {
  const { classes } = useThemeContext();
  const { data: sleepSettings } = useSleepSettings();
  const { data: workSettings } = useWorkSettings();
  const saveSleepMutation = useSaveSleepSettings();
  const saveWorkMutation = useSaveWorkSettings();
  
  // Estados para sueño
  const [wakeupTime, setWakeupTime] = useState<string>('07:00');
  const [desiredSleepHours, setDesiredSleepHours] = useState<number>(7);
  const [sleepReminders, setSleepReminders] = useState<boolean>(true);

  // Estados para trabajo
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('18:00');

  useEffect(() => {
    if (sleepSettings) {
      setWakeupTime(sleepSettings.wakeupTime);
      setDesiredSleepHours(sleepSettings.desiredSleepHours);
      setSleepReminders(sleepSettings.sleepReminders);
    }
  }, [sleepSettings]);

  useEffect(() => {
    if (workSettings) {
      setStartTime(workSettings.startTime);
      setEndTime(workSettings.endTime);
    }
  }, [workSettings]);

  const handleSaveSleep = () => {
    const newSettings: SleepSettings = {
      id: sleepSettings?.id || crypto.randomUUID(),
      wakeupTime,
      desiredSleepHours,
      sleepReminders,
      updatedAt: new Date().toISOString(),
      ...(sleepSettings?.createdAt && { createdAt: sleepSettings.createdAt }),
    };

    saveSleepMutation.mutate(newSettings);
  };

  const handleSaveWork = () => {
    const newSettings: WorkSettings = {
      id: workSettings?.id || crypto.randomUUID(),
      startTime,
      endTime,
      updatedAt: new Date().toISOString(),
      ...(workSettings?.createdAt && { createdAt: workSettings.createdAt }),
    };

    saveWorkMutation.mutate(newSettings);
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
            Configuración General
          </CardTitle>
          <CardDescription>
            Define tus horarios de sueño y trabajo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          {/* Configuración de Sueño */}
          <div className="space-y-4 pb-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="h-4 w-4" />
              <h3 className="font-semibold">Control de Sueño</h3>
            </div>
            
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
                onClick={handleSaveSleep}
                disabled={saveSleepMutation.isPending}
                className="w-full"
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveSleepMutation.isPending ? 'Guardando...' : 'Guardar configuración de sueño'}
              </Button>
            </motion.div>
          </div>

          {/* Configuración de Trabajo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4" />
              <h3 className="font-semibold">Horario Laboral</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de entrada</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A qué hora empiezas a trabajar
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de salida</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A qué hora terminas de trabajar
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSaveWork}
                disabled={saveWorkMutation.isPending}
                className="w-full"
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveWorkMutation.isPending ? 'Guardando...' : 'Guardar configuración de trabajo'}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

