// TIPOS PARA SISTEMA DE TEMAS
export type ThemePalette = 'blue-cyan-teal' | 'pink-red-orange' | 'teal-cyan-blue' | 'deep-blue';

export interface ThemeConfig {
  palette: ThemePalette;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    border: string;
    shadow: string;
  };
}

export const THEMES: Record<ThemePalette, ThemeConfig> = {
  'blue-cyan-teal': {
    palette: 'blue-cyan-teal',
    name: 'Azul → Cyan → Teal',
    colors: {
      primary: 'blue',
      secondary: 'cyan',
      accent: 'teal',
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      border: 'blue-500',
      shadow: 'blue-500',
    },
  },
  'pink-red-orange': {
    palette: 'pink-red-orange',
    name: 'Rosa → Rojo → Naranja',
    colors: {
      primary: 'pink',
      secondary: 'red',
      accent: 'orange',
      gradient: 'from-pink-400 via-red-400 to-orange-400',
      border: 'pink-500',
      shadow: 'pink-500',
    },
  },
  'teal-cyan-blue': {
    palette: 'teal-cyan-blue',
    name: 'Verde Agua → Cyan → Azul',
    colors: {
      primary: 'teal',
      secondary: 'cyan',
      accent: 'blue',
      gradient: 'from-teal-400 via-cyan-400 to-blue-400',
      border: 'teal-500',
      shadow: 'teal-500',
    },
  },
  'deep-blue': {
    palette: 'deep-blue',
    name: 'Azul Profundo',
    colors: {
      primary: 'blue',
      secondary: 'sky',
      accent: 'cyan',
      gradient: 'from-blue-600 via-sky-400 to-cyan-400',
      border: 'blue-500',
      shadow: 'blue-500',
    },
  },
};

