"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";

interface WindDownStep {
  id: string;
  title: string;
  duration: number; // minutos
  description: string;
}

const WIND_DOWN_STEPS: WindDownStep[] = [
  {
    id: "1",
    title: "Respiracion profunda",
    duration: 5,
    description: "Inhala 4 segundos, manten 4, exhala 4",
  },
  {
    id: "2",
    title: "Apagar pantallas",
    duration: 0,
    description: "Reduce la luz azul 30 minutos antes",
  },
  {
    id: "3",
    title: "Relajacion muscular",
    duration: 10,
    description: "Tensa y relaja cada grupo muscular",
  },
];

export function WindDownCard() {
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
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const currentStepData = WIND_DOWN_STEPS[currentStep];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Rutina Pre-Sueno
        </CardTitle>
        <CardDescription>Preparate para un descanso reparador</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                <div className="text-4xl font-semibold tabular-nums">
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              {!isActive ? (
                <Button onClick={startRoutine} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar
                </Button>
              ) : (
                <Button
                  onClick={pauseRoutine}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              )}
              <Button onClick={resetRoutine} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Indicador de progreso */}
            <div className="space-y-1">
              {WIND_DOWN_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-1 rounded ${
                    index < currentStep
                      ? "bg-primary"
                      : index === currentStep
                        ? "bg-primary/50"
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-lg font-semibold mb-2">Rutina completada!</div>
            <div className="text-sm text-muted-foreground mb-4">
              Estas listo para un descanso reparador
            </div>
            <Button onClick={resetRoutine} variant="outline">
              Reiniciar rutina
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
