import { cn } from "./utils";

// ============================================================================
// Focus Ring Utility
// ============================================================================

export const focusRing = cn(
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
);

// ============================================================================
// Disabled State Utility
// ============================================================================

export const disabledState = cn(
  "disabled:pointer-events-none",
  "disabled:opacity-50",
);

// ============================================================================
// Card Variants
// ============================================================================

export const cardVariants = {
  default: cn("bg-card", "border", "border-border"),
  muted: cn("bg-muted", "border", "border-border"),
  subtle: cn("bg-muted/50", "border", "border-border/50"),
};

// ============================================================================
// Hover Scale Utility
// ============================================================================

export const hoverScale = cn(
  "transition-transform",
  "duration-200",
  "hover:scale-[1.02]",
  "active:scale-[0.98]",
);

// ============================================================================
// Card Depth Utility
// ============================================================================

export const cardDepth = cn(
  "transition-shadow",
  "duration-300",
  "hover:shadow-lg",
  "hover:shadow-foreground/5",
);

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
