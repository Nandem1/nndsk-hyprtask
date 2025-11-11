'use client';

import LayoutWithHeader from '@/app/layout-with-header';
import { GeneralConfig } from '@/components/config/general-config';
import { ThemePaletteSelector } from '@/components/theme-palette-selector';
import { useThemeContext } from '@/components/theme-provider-context';

function ConfigContent() {
  const { classes } = useThemeContext();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className={`text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r ${classes.gradient} bg-clip-text text-transparent`}>
          Configuración
        </h1>
        <p className="text-muted-foreground">
          Personaliza tu experiencia
        </p>
      </div>

      <div className="space-y-6">
        <GeneralConfig />
        <ThemePaletteSelector />
      </div>
    </div>
  );
}

export default function ConfigPage() {
  return (
    <LayoutWithHeader>
      <ConfigContent />
    </LayoutWithHeader>
  );
}

