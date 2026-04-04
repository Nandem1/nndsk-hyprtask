// TIPOS PARA SISTEMA DE TEMAS EXTENDIDO
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
    particle: string;
  };
}

export interface ExtendedThemeClasses {
  // Clases base existentes
  gradient: string;
  gradientBg: string;
  gradientBgSolid: string;
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
  
  // Nuevas clases extendidas
  glassBg: string;
  glassBorder: string;
  glassBorderStrong: string;
  depthShadow: string;
  depthShadowHover: string;
  animatedGradient: string;
  particleColor: string;
  shimmer: string;
  glowPulse: string;
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
      particle: '#60A5FA',
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
      particle: '#C084FC',
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
      particle: '#2DD4BF',
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
      particle: '#F472B6',
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
      particle: '#F87171',
    },
  },
};

export const THEME_BASE_CLASSES: Record<ThemePalette, Omit<ExtendedThemeClasses, 'glassBg' | 'glassBorder' | 'glassBorderStrong' | 'depthShadow' | 'depthShadowHover' | 'animatedGradient' | 'particleColor' | 'shimmer' | 'glowPulse'>> = {
  genshin: {
    gradient: "from-blue-500 to-cyan-500",
    gradientBg: "bg-blue-500/10",
    gradientBgSolid: "bg-blue-500",
    gradientBgSubtle: "bg-blue-500/5",
    border: "border-blue-500/30",
    borderHover: "border-blue-500/50",
    shadow: "shadow-blue-500/5",
    shadowHover: "shadow-blue-500/10",
    textPrimary: "text-blue-400",
    textSecondary: "text-cyan-400",
    textAccent: "text-teal-400",
    iconGradient: "text-blue-400",
    glow: "shadow-blue-500/10",
    glowStrong: "shadow-blue-500/20",
  },
  zenless: {
    gradient: "from-purple-500 to-pink-500",
    gradientBg: "bg-purple-500/10",
    gradientBgSolid: "bg-purple-500",
    gradientBgSubtle: "bg-purple-500/5",
    border: "border-purple-500/30",
    borderHover: "border-purple-500/50",
    shadow: "shadow-purple-500/5",
    shadowHover: "shadow-purple-500/10",
    textPrimary: "text-purple-400",
    textSecondary: "text-pink-400",
    textAccent: "text-fuchsia-400",
    iconGradient: "text-purple-400",
    glow: "shadow-purple-500/10",
    glowStrong: "shadow-purple-500/20",
  },
  wuthering: {
    gradient: "from-teal-500 to-cyan-500",
    gradientBg: "bg-teal-500/10",
    gradientBgSolid: "bg-teal-500",
    gradientBgSubtle: "bg-teal-500/5",
    border: "border-teal-500/30",
    borderHover: "border-teal-500/50",
    shadow: "shadow-teal-500/5",
    shadowHover: "shadow-teal-500/10",
    textPrimary: "text-teal-400",
    textSecondary: "text-cyan-400",
    textAccent: "text-sky-400",
    iconGradient: "text-teal-400",
    glow: "shadow-teal-500/10",
    glowStrong: "shadow-teal-500/20",
  },
  osu: {
    gradient: "from-pink-500 to-rose-500",
    gradientBg: "bg-pink-500/10",
    gradientBgSolid: "bg-pink-500",
    gradientBgSubtle: "bg-pink-500/5",
    border: "border-pink-500/30",
    borderHover: "border-pink-500/50",
    shadow: "shadow-pink-500/5",
    shadowHover: "shadow-pink-500/10",
    textPrimary: "text-pink-400",
    textSecondary: "text-rose-400",
    textAccent: "text-fuchsia-400",
    iconGradient: "text-pink-400",
    glow: "shadow-pink-500/10",
    glowStrong: "shadow-pink-500/20",
  },
  mario: {
    gradient: "from-red-500 to-orange-500",
    gradientBg: "bg-red-500/10",
    gradientBgSolid: "bg-red-500",
    gradientBgSubtle: "bg-red-500/5",
    border: "border-red-500/30",
    borderHover: "border-red-500/50",
    shadow: "shadow-red-500/5",
    shadowHover: "shadow-red-500/10",
    textPrimary: "text-red-400",
    textSecondary: "text-orange-400",
    textAccent: "text-yellow-400",
    iconGradient: "text-red-400",
    glow: "shadow-red-500/10",
    glowStrong: "shadow-red-500/20",
  },
};

export const THEME_EXTENDED_CLASSES: Record<ThemePalette, Pick<ExtendedThemeClasses, 'glassBg' | 'glassBorder' | 'glassBorderStrong' | 'depthShadow' | 'depthShadowHover' | 'animatedGradient' | 'particleColor' | 'shimmer' | 'glowPulse'>> = {
  genshin: {
    glassBg: "bg-blue-500/5 backdrop-blur-xl",
    glassBorder: "border-blue-400/20",
    glassBorderStrong: "border-blue-400/40",
    depthShadow: "shadow-blue-500/10 shadow-2xl",
    depthShadowHover: "shadow-blue-500/20 shadow-2xl",
    animatedGradient: "bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20",
    particleColor: "#60A5FA",
    shimmer: "bg-gradient-to-r from-transparent via-blue-400/20 to-transparent",
    glowPulse: "shadow-blue-500/30 animate-pulse-glow",
  },
  zenless: {
    glassBg: "bg-purple-500/5 backdrop-blur-xl",
    glassBorder: "border-purple-400/20",
    glassBorderStrong: "border-purple-400/40",
    depthShadow: "shadow-purple-500/10 shadow-2xl",
    depthShadowHover: "shadow-purple-500/20 shadow-2xl",
    animatedGradient: "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-fuchsia-500/20",
    particleColor: "#C084FC",
    shimmer: "bg-gradient-to-r from-transparent via-purple-400/20 to-transparent",
    glowPulse: "shadow-purple-500/30 animate-pulse-glow",
  },
  wuthering: {
    glassBg: "bg-teal-500/5 backdrop-blur-xl",
    glassBorder: "border-teal-400/20",
    glassBorderStrong: "border-teal-400/40",
    depthShadow: "shadow-teal-500/10 shadow-2xl",
    depthShadowHover: "shadow-teal-500/20 shadow-2xl",
    animatedGradient: "bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-sky-500/20",
    particleColor: "#2DD4BF",
    shimmer: "bg-gradient-to-r from-transparent via-teal-400/20 to-transparent",
    glowPulse: "shadow-teal-500/30 animate-pulse-glow",
  },
  osu: {
    glassBg: "bg-pink-500/5 backdrop-blur-xl",
    glassBorder: "border-pink-400/20",
    glassBorderStrong: "border-pink-400/40",
    depthShadow: "shadow-pink-500/10 shadow-2xl",
    depthShadowHover: "shadow-pink-500/20 shadow-2xl",
    animatedGradient: "bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-fuchsia-500/20",
    particleColor: "#F472B6",
    shimmer: "bg-gradient-to-r from-transparent via-pink-400/20 to-transparent",
    glowPulse: "shadow-pink-500/30 animate-pulse-glow",
  },
  mario: {
    glassBg: "bg-red-500/5 backdrop-blur-xl",
    glassBorder: "border-red-400/20",
    glassBorderStrong: "border-red-400/40",
    depthShadow: "shadow-red-500/10 shadow-2xl",
    depthShadowHover: "shadow-red-500/20 shadow-2xl",
    animatedGradient: "bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20",
    particleColor: "#F87171",
    shimmer: "bg-gradient-to-r from-transparent via-red-400/20 to-transparent",
    glowPulse: "shadow-red-500/30 animate-pulse-glow",
  },
};
