import { cn } from "./utils";

// ============================================================================
// Focus Ring Utility
// ============================================================================

export const focusRing = cn(
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background"
);

// ============================================================================
// Disabled State Utility
// ============================================================================

export const disabledState = cn(
  "disabled:pointer-events-none",
  "disabled:opacity-50"
);

// ============================================================================
// Glass Effect Variants
// ============================================================================

export const glassVariants = {
  default: cn(
    "bg-white/5",
    "backdrop-blur-xl",
    "border",
    "border-white/10"
  ),
  dark: cn(
    "bg-black/20",
    "backdrop-blur-xl",
    "border",
    "border-white/10"
  ),
  subtle: cn(
    "bg-white/[0.02]",
    "backdrop-blur-lg",
    "border",
    "border-white/5"
  ),
};

// ============================================================================
// Hover Scale Utility
// ============================================================================

export const hoverScale = cn(
  "transition-transform",
  "duration-200",
  "hover:scale-[1.02]",
  "active:scale-[0.98]"
);

// ============================================================================
// Card Depth Utility
// ============================================================================

export const cardDepth = cn(
  "transition-shadow",
  "duration-300",
  "hover:shadow-lg",
  "hover:shadow-foreground/5"
);

// ============================================================================
// Text Gradient Utility
// ============================================================================

export function textGradient(from: string, to: string) {
  return cn(
    "bg-gradient-to-r",
    from,
    to,
    "bg-clip-text",
    "text-transparent"
  );
}

// ============================================================================
// Animation Delay Utilities
// ============================================================================

export const animationDelays = {
  0: "",
  1: "[animation-delay:100ms]",
  2: "[animation-delay:200ms]",
  3: "[animation-delay:300ms]",
  4: "[animation-delay:400ms]",
  5: "[animation-delay:500ms]",
} as const;
