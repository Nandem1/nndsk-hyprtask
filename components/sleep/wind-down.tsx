'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { useThemeContext } from '@/components/theme-provider-context';

interface WindDownStep {
  id: string;
  title: string;
  duration: number; // minutos
  description: string;
}

const WIND_DOWN_STEPS: WindDownStep[] = [
  {
    id: '1',
    title: 'Respiración profunda',
    duration: 5,
    description: 'Inhala 4 segundos, mantén 4, exhala 4',
  },
  {
    id: '2',
    title: 'Apagar pantallas',
    duration: 0,
    description: 'Reduce la luz azul 30 minutos antes',
  },
  {
    id: '3',
    title: 'Relajación muscular',
    duration: 10,
    description: 'Tensa y relaja cada grupo muscular',
  },
];

export function WindDown() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const startRoutine = () => {
    if (currentStep >= WIND_DOWN_STEPS.length) {
      setCurrentStep(0);
    }
    setIsActive(true);
    const step = WIND_DOWN_STEPS[currentStep];
    setTimeRemaining(step.duration * 60);
  };

  const pauseRoutine = () => {
    setIsActive(false);
  };

  const resetRoutine = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTimeRemaining(0);
  };

  // Efecto para avanzar al siguiente paso cuando el tiempo llega a 0
  useEffect(() => {
    if (isActive && timeRemaining === 0) {
      if (currentStep < WIND_DOWN_STEPS.length - 1) {
        const nextStepIndex = currentStep + 1;
        setCurrentStep(nextStepIndex);
        const step = WIND_DOWN_STEPS[nextStepIndex];
        setTimeRemaining(step.duration * 60);
      } else {
        setIsActive(false);
      }
    }
  }, [isActive, timeRemaining, currentStep]);

  // Timer effect
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentStepData = WIND_DOWN_STEPS[currentStep];
  const { classes } = useThemeContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
    >
      <Card className={`relative overflow-hidden border ${classes.border} bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm shadow-xl ${classes.shadow} transition-all duration-300 hover:shadow-2xl ${classes.shadowHover} hover:${classes.borderHover}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${classes.gradientBgSubtle} opacity-50`} />
        <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Rutina Pre-Sueño
        </CardTitle>
        <CardDescription>
          Prepárate para un descanso reparador
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {currentStep < WIND_DOWN_STEPS.length ? (
          <>
            <div className="text-center py-4">
              <div className="text-3xl font-bold mb-2">
                {currentStepData.title}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {currentStepData.description}
              </div>
              {currentStepData.duration > 0 && (
                <div className="text-4xl font-mono font-semibold">
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              {!isActive ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button onClick={startRoutine} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button onClick={pauseRoutine} variant="outline" className="w-full">
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={resetRoutine} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* Indicador de progreso */}
            <div className="space-y-1">
              {WIND_DOWN_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-1 rounded ${
                    index < currentStep
                      ? 'bg-primary'
                      : index === currentStep
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-lg font-semibold mb-2">
              ¡Rutina completada!
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Estás listo para un descanso reparador
            </div>
            <Button onClick={resetRoutine} variant="outline">
              Reiniciar rutina
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}

