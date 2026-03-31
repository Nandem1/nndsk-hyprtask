import type { ThemePalette } from "@/shared/types/theme";

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
  const classMap: Record<ThemePalette, ThemeClasses> = {
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
