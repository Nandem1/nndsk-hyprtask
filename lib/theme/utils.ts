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

// Helper para construir clases dinámicas (Tailwind necesita las clases completas)
export function getThemeClassesString(palette: ThemePalette) {
  const theme = THEMES[palette];
  
  const classMap: Record<string, string> = {
    'blue-cyan-teal': {
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      gradientBg: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
      gradientBgSubtle: 'from-blue-500/5 via-cyan-500/5 to-teal-500/5',
      border: 'border-blue-500/20',
      borderHover: 'border-blue-500/30',
      shadow: 'shadow-blue-500/5',
      shadowHover: 'shadow-blue-500/10',
      textPrimary: 'text-blue-300',
      textSecondary: 'text-cyan-300',
      textAccent: 'text-teal-300',
      iconGradient: 'from-blue-400 to-cyan-400',
    },
    'pink-red-orange': {
      gradient: 'from-pink-400 via-red-400 to-orange-400',
      gradientBg: 'from-pink-500/20 via-red-500/20 to-orange-500/20',
      gradientBgSubtle: 'from-pink-500/5 via-red-500/5 to-orange-500/5',
      border: 'border-pink-500/20',
      borderHover: 'border-pink-500/30',
      shadow: 'shadow-pink-500/5',
      shadowHover: 'shadow-pink-500/10',
      textPrimary: 'text-pink-300',
      textSecondary: 'text-red-300',
      textAccent: 'text-orange-300',
      iconGradient: 'from-pink-400 to-red-400',
    },
    'teal-cyan-blue': {
      gradient: 'from-teal-400 via-cyan-400 to-blue-400',
      gradientBg: 'from-teal-500/20 via-cyan-500/20 to-blue-500/20',
      gradientBgSubtle: 'from-teal-500/5 via-cyan-500/5 to-blue-500/5',
      border: 'border-teal-500/20',
      borderHover: 'border-teal-500/30',
      shadow: 'shadow-teal-500/5',
      shadowHover: 'shadow-teal-500/10',
      textPrimary: 'text-teal-300',
      textSecondary: 'text-cyan-300',
      textAccent: 'text-blue-300',
      iconGradient: 'from-teal-400 to-cyan-400',
    },
    'deep-blue': {
      gradient: 'from-blue-600 via-sky-400 to-cyan-400',
      gradientBg: 'from-blue-500/20 via-sky-500/20 to-cyan-500/20',
      gradientBgSubtle: 'from-blue-500/5 via-sky-500/5 to-cyan-500/5',
      border: 'border-blue-500/20',
      borderHover: 'border-blue-500/30',
      shadow: 'shadow-blue-500/5',
      shadowHover: 'shadow-blue-500/10',
      textPrimary: 'text-blue-300',
      textSecondary: 'text-sky-300',
      textAccent: 'text-cyan-300',
      iconGradient: 'from-blue-600 to-sky-400',
    },
  };
  
  return classMap[palette];
}

