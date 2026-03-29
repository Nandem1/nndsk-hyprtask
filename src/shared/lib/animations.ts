import type { Variants, Transition } from 'framer-motion';

export const easings = {
  standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
  decelerate: [0, 0, 0.2, 1] as [number, number, number, number],
  accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
};

export const transitions = {
  standard: { duration: 0.5, ease: easings.standard } satisfies Transition,
  fast: { duration: 0.3, ease: easings.standard } satisfies Transition,
  spring: { type: 'spring' as const, damping: 25, stiffness: 200 } satisfies Transition,
};

export const variants = {
  fadeSlideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  } satisfies Variants,
  fadeScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  } satisfies Variants,
  slideInLeft: {
    initial: { x: -280 },
    animate: { x: 0 },
    exit: { x: -280 },
  } satisfies Variants,
};

export const tapGestures = {
  standard: { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } },
  icon: { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 } },
};
