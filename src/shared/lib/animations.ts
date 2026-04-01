import type { Variants, Transition } from "framer-motion";

// ============================================================================
// Easing Functions
// ============================================================================

export const easings = {
  standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
  decelerate: [0, 0, 0.2, 1] as [number, number, number, number],
  accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
};

// ============================================================================
// Transition Presets
// ============================================================================

// ============================================================================
// Performance-First Transition System
// Categorized by use case for consistent, GPU-accelerated animations
// ============================================================================

export const transitions = {
  /**
   * Micro-interactions (hover, focus, small UI feedback)
   * Fast, snappy response
   */
  micro: {
    duration: 0.15,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  } satisfies Transition,

  /**
   * Enter/Exit animations for components
   * Smooth but not bouncy
   */
  enterExit: {
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  } satisfies Transition,

  /**
   * Layout animations (reordering, expanding)
   * Use sparingly - more expensive
   */
  layout: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
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

  /**
   * Stiff spring for precise movements
   * Quick settle with minimal bounce
   */
  springStiff: {
    type: "spring" as const,
    damping: 30,
    stiffness: 400,
  } satisfies Transition,
} as const;

// ============================================================================
// Animation Variants
// ============================================================================

export const animations: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleInUp: {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  slideInUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  slideInDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
};

// ============================================================================
// Exit Variants
// ============================================================================

export const exitAnimations: Record<string, Variants> = {
  fadeOut: {
    exit: { opacity: 0 },
  },
  fadeOutDown: {
    exit: { opacity: 0, y: 20 },
  },
  fadeOutUp: {
    exit: { opacity: 0, y: -20 },
  },
  scaleOut: {
    exit: { opacity: 0, scale: 0.9 },
  },
  slideOutLeft: {
    exit: { opacity: 0, x: -50 },
  },
  slideOutRight: {
    exit: { opacity: 0, x: 50 },
  },
};

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

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// List Variants
// ============================================================================

export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
};

// ============================================================================
// Card Variants
// ============================================================================

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
  tap: {
    scale: 0.98,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// Modal/Dialog Variants
// ============================================================================

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// Sidebar Variants
// ============================================================================

export const sidebarVariants: Variants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: {
    x: -280,
    opacity: 0,
    transition: { duration: 0.3, ease: easings.standard },
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
