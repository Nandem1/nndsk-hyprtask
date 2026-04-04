"use client";

import { useThemeState } from "@/store/hooks";
import { ThemePaletteSelector } from "./ThemePaletteSelector";
import { SleepConfigForm } from "@/features/configure-sleep";
import { WorkConfigForm } from "@/features/configure-work";
import { EmoteManager } from "@/features/emote-picker";
import { Smile } from "lucide-react";

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

      <div className="flex flex-col gap-6">
        <SleepConfigForm />
        <WorkConfigForm />
        <ThemePaletteSelector />

        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Smile className="size-5" />
              Emotes 7TV
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Agrega emotes a tu colección para usarlos en notas y títulos
            </p>
          </div>
          <EmoteManager />
        </div>
      </div>
    </div>
  );
}
