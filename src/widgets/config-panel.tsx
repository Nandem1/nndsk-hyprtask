"use client";

import { useThemeState } from "@/store/hooks";
import { ThemePaletteSelector } from "@/shared/theme";
import { SleepConfigForm } from "@/entities/sleep";
import { WorkConfigForm } from "@/entities/work";

export function ConfigPanel() {
  const { themeClasses } = useThemeState();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1
          className={`text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r ${themeClasses.gradient} bg-clip-text text-transparent`}
        >
          Configuracion
        </h1>
        <p className="text-muted-foreground">Personaliza tu experiencia</p>
      </div>

      <div className="space-y-6">
        <SleepConfigForm />
        <WorkConfigForm />
        <ThemePaletteSelector />
      </div>
    </div>
  );
}
