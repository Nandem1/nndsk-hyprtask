import type { ThemePalette, ExtendedThemeClasses } from "@/shared/types/theme";

// Helper para construir clases dinámicas extendidas
export function getExtendedThemeClasses(palette: ThemePalette): ExtendedThemeClasses {
  const baseClasses = getThemeClassesString(palette);

  const extendedMap: Record<ThemePalette, Omit<ExtendedThemeClasses, keyof typeof baseClasses>> = {
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

  return {
    ...baseClasses,
    ...extendedMap[palette],
  };
}

// Función original mantenida para compatibilidad
export function getThemeClassesString(palette: ThemePalette) {
  const classMap = {
    genshin: {
      gradient: "from-blue-500 to-cyan-500",
      gradientBg: "bg-blue-500/10",
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
  } as const;

  return classMap[palette];
}

// Tipo de retorno para las clases del tema (legacy)
export type ThemeClasses = ReturnType<typeof getThemeClassesString>;
