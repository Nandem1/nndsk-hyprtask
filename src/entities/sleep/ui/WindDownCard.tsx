"use client";

import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
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
  duration: number;
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
          <Wind className="size-5" />
          Rutina Pre-Sueno
        </CardTitle>
        <CardDescription>Preparate para un descanso reparador</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {currentStep < WIND_DOWN_STEPS.length ? (
          <>
            <div className="text-center py-4">
              <div className="text-3xl font-bold mb-2">
                {currentStepData.title}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {currentStepData.description}
              </div>
              {currentStepData.duration > 0 ? (
                <div className="text-4xl font-semibold tabular-nums">
                  {formatTime(timeRemaining)}
                </div>
              ) : null}
            </div>

            <div className="flex gap-2 justify-center">
              {!isActive ? (
                <Button onClick={startRoutine} className="flex-1">
                  <Play data-icon="inline-start" />
                  Iniciar
                </Button>
              ) : (
                <Button
                  onClick={pauseRoutine}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause data-icon="inline-start" />
                  Pausar
                </Button>
              )}
              <Button onClick={resetRoutine} variant="outline">
                <RotateCcw />
              </Button>
            </div>

            <div className="flex flex-col gap-1">
              {WIND_DOWN_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "h-1 rounded",
                    index < currentStep
                      ? "bg-primary"
                      : index === currentStep
                        ? "bg-primary/50"
                        : "bg-muted",
                  )}
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
