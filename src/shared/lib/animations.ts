import type { Variants, Transition } from "framer-motion";

// ============================================================================
// Easing Functions
// ============================================================================

const EASE_DEFAULT = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

// ============================================================================
// Performance-First Transition System
// Categorized by use case for consistent, GPU-accelerated animations
// ============================================================================

export const transitions = {
  /**
   * Enter/Exit animations for components
   * Smooth but not bouncy
   */
  enterExit: {
    duration: 0.2,
    ease: EASE_DEFAULT,
  } satisfies Transition,

  /**
   * Spring physics for natural feel
   * Use only when physics matter (drag, gestures)
   */
  spring: {
    type: "spring" as const,
    damping: 25,
    stiffness: 200,
  } satisfies Transition,

  /**
   * Bouncy spring for celebrations/feedback
   * Higher impact, use sparingly
   */
  springBouncy: {
    type: "spring" as const,
    damping: 15,
    stiffness: 300,
  } satisfies Transition,
} as const;

// ============================================================================
// Container Variants (for staggered children)
// ============================================================================

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

// ============================================================================
// List Variants
// ============================================================================

export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
};

// ============================================================================
// Tap Gestures
// ============================================================================

export const tapGestures = {
  standard: { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } },
  subtle: { whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 } },
  icon: { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 } },
  button: { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } },
};

// ============================================================================
// Reduced Motion Support
// ============================================================================

export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// ============================================================================
// Fullscreen Timer Variants
// ============================================================================

export const fullscreenContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: EASE_DEFAULT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EASE_DEFAULT },
  },
};

export const contentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_DEFAULT, delay: 0.1 },
  },
  exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } },
};

export const timerModeVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: EASE_DEFAULT },
  },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
};
