// TIPOS PARA SISTEMA DE TEMAS - COMFY/INDIE/NERD
export type ThemePalette = 'genshin' | 'zenless' | 'wuthering' | 'osu' | 'mario';

export interface ThemeConfig {
  palette: ThemePalette;
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    border: string;
    shadow: string;
    glow: string;
  };
}

export const THEMES: Record<ThemePalette, ThemeConfig> = {
  'genshin': {
    palette: 'genshin',
    name: 'Genshin',
    emoji: '✨',
    colors: {
      primary: 'blue',
      secondary: 'cyan',
      accent: 'teal',
      gradient: 'from-blue-300/80 via-cyan-300/80 to-teal-300/80',
      border: 'blue-400/30',
      shadow: 'blue-400/20',
      glow: 'blue-300/40',
    },
  },
  'zenless': {
    palette: 'zenless',
    name: 'Zenless',
    emoji: '🎮',
    colors: {
      primary: 'purple',
      secondary: 'pink',
      accent: 'fuchsia',
      gradient: 'from-purple-300/80 via-pink-300/80 to-fuchsia-300/80',
      border: 'purple-400/30',
      shadow: 'purple-400/20',
      glow: 'purple-300/40',
    },
  },
  'wuthering': {
    palette: 'wuthering',
    name: 'Wuthering',
    emoji: '🌊',
    colors: {
      primary: 'teal',
      secondary: 'cyan',
      accent: 'sky',
      gradient: 'from-teal-300/80 via-cyan-300/80 to-sky-300/80',
      border: 'teal-400/30',
      shadow: 'teal-400/20',
      glow: 'teal-300/40',
    },
  },
  'osu': {
    palette: 'osu',
    name: 'osu!',
    emoji: '💗',
    colors: {
      primary: 'pink',
      secondary: 'rose',
      accent: 'fuchsia',
      gradient: 'from-pink-300/80 via-rose-300/80 to-fuchsia-300/80',
      border: 'pink-400/30',
      shadow: 'pink-400/20',
      glow: 'pink-300/40',
    },
  },
  'mario': {
    palette: 'mario',
    name: 'Mario',
    emoji: '🍄',
    colors: {
      primary: 'red',
      secondary: 'orange',
      accent: 'yellow',
      gradient: 'from-red-300/80 via-orange-300/80 to-yellow-300/80',
      border: 'red-400/30',
      shadow: 'red-400/20',
      glow: 'red-300/40',
    },
  },
};

