// UTILIDADES PARA APLICAR TEMAS
import { THEMES } from '@/types/theme';
import type { ThemePalette } from '@/types/theme';

export function getThemeClasses(palette: ThemePalette) {
  const theme = THEMES[palette];
  
  return {
    gradient: theme.colors.gradient,
    gradientBg: `bg-gradient-to-r from-${theme.colors.primary}-500/20 via-${theme.colors.secondary}-500/20 to-${theme.colors.accent}-500/20`,
    gradientBgSubtle: `bg-gradient-to-r from-${theme.colors.primary}-500/5 via-${theme.colors.secondary}-500/5 to-${theme.colors.accent}-500/5`,
    border: `border-${theme.colors.border}/20`,
    borderHover: `border-${theme.colors.border}/30`,
    shadow: `shadow-${theme.colors.shadow}/5`,
    shadowHover: `shadow-${theme.colors.shadow}/10`,
    textPrimary: `text-${theme.colors.primary}-300`,
    textSecondary: `text-${theme.colors.secondary}-300`,
    textAccent: `text-${theme.colors.accent}-300`,
    iconGradient: `bg-gradient-to-r from-${theme.colors.primary}-400 to-${theme.colors.secondary}-400`,
  };
}

// Tipo de retorno para las clases del tema
export type ThemeClasses = {
  gradient: string;
  gradientBg: string;
  gradientBgSubtle: string;
  border: string;
  borderHover: string;
  shadow: string;
  shadowHover: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  iconGradient: string;
  glow: string;
  glowStrong: string;
};

// Helper para construir clases dinámicas (Tailwind necesita las clases completas)
export function getThemeClassesString(palette: ThemePalette): ThemeClasses {
  const theme = THEMES[palette];
  
  const classMap: Record<ThemePalette, ThemeClasses> = {
    'genshin': {
      gradient: 'from-blue-300 via-cyan-300 to-teal-300',
      gradientBg: 'from-blue-400/10 via-cyan-400/10 to-teal-400/10',
      gradientBgSubtle: 'from-blue-400/5 via-cyan-400/5 to-teal-400/5',
      border: 'border-blue-400/20',
      borderHover: 'border-blue-400/40',
      shadow: 'shadow-blue-400/10',
      shadowHover: 'shadow-blue-400/15',
      textPrimary: 'text-blue-200',
      textSecondary: 'text-cyan-200',
      textAccent: 'text-teal-200',
      iconGradient: 'from-blue-300 to-cyan-300',
      glow: 'shadow-blue-300/20',
      glowStrong: 'shadow-blue-300/30',
    },
    'zenless': {
      gradient: 'from-purple-300 via-pink-300 to-fuchsia-300',
      gradientBg: 'from-purple-400/10 via-pink-400/10 to-fuchsia-400/10',
      gradientBgSubtle: 'from-purple-400/5 via-pink-400/5 to-fuchsia-400/5',
      border: 'border-purple-400/20',
      borderHover: 'border-purple-400/40',
      shadow: 'shadow-purple-400/10',
      shadowHover: 'shadow-purple-400/15',
      textPrimary: 'text-purple-200',
      textSecondary: 'text-pink-200',
      textAccent: 'text-fuchsia-200',
      iconGradient: 'from-purple-300 to-pink-300',
      glow: 'shadow-purple-300/20',
      glowStrong: 'shadow-purple-300/30',
    },
    'wuthering': {
      gradient: 'from-teal-300 via-cyan-300 to-sky-300',
      gradientBg: 'from-teal-400/10 via-cyan-400/10 to-sky-400/10',
      gradientBgSubtle: 'from-teal-400/5 via-cyan-400/5 to-sky-400/5',
      border: 'border-teal-400/20',
      borderHover: 'border-teal-400/40',
      shadow: 'shadow-teal-400/10',
      shadowHover: 'shadow-teal-400/15',
      textPrimary: 'text-teal-200',
      textSecondary: 'text-cyan-200',
      textAccent: 'text-sky-200',
      iconGradient: 'from-teal-300 to-cyan-300',
      glow: 'shadow-teal-300/20',
      glowStrong: 'shadow-teal-300/30',
    },
    'osu': {
      gradient: 'from-pink-300 via-rose-300 to-fuchsia-300',
      gradientBg: 'from-pink-400/10 via-rose-400/10 to-fuchsia-400/10',
      gradientBgSubtle: 'from-pink-400/5 via-rose-400/5 to-fuchsia-400/5',
      border: 'border-pink-400/20',
      borderHover: 'border-pink-400/40',
      shadow: 'shadow-pink-400/10',
      shadowHover: 'shadow-pink-400/15',
      textPrimary: 'text-pink-200',
      textSecondary: 'text-rose-200',
      textAccent: 'text-fuchsia-200',
      iconGradient: 'from-pink-300 to-rose-300',
      glow: 'shadow-pink-300/20',
      glowStrong: 'shadow-pink-300/30',
    },
    'mario': {
      gradient: 'from-red-300 via-orange-300 to-yellow-300',
      gradientBg: 'from-red-400/10 via-orange-400/10 to-yellow-400/10',
      gradientBgSubtle: 'from-red-400/5 via-orange-400/5 to-yellow-400/5',
      border: 'border-red-400/20',
      borderHover: 'border-red-400/40',
      shadow: 'shadow-red-400/10',
      shadowHover: 'shadow-red-400/15',
      textPrimary: 'text-red-200',
      textSecondary: 'text-orange-200',
      textAccent: 'text-yellow-200',
      iconGradient: 'from-red-300 to-orange-300',
      glow: 'shadow-red-300/20',
      glowStrong: 'shadow-red-300/30',
    },
  } as const;
  
  return classMap[palette];
}

