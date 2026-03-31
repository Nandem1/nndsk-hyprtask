'use client';

import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { transitions } from '@/shared/lib/animations';

interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  delayChildren?: number;
  layout?: boolean;
}

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  itemClassName,
  staggerDelay = 0.05,
  delayChildren = 0.05,
  layout = true,
}: AnimatedListProps<T>) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
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

  const itemVariants: Variants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, x: -20, scale: 0.95 },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 400, damping: 30 },
        },
        exit: {
          opacity: 0,
          x: 20,
          scale: 0.95,
          transition: { duration: 0.2 },
        },
      };

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.li
            key={keyExtractor(item, index)}
            variants={itemVariants}
            layout={layout}
            className={itemClassName}
          >
            {renderItem(item, index)}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

// Animated list with filtered items (handles enter/exit)
interface FilteredAnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  filterFn?: (item: T) => boolean;
  className?: string;
  itemClassName?: string;
  emptyState?: ReactNode;
  staggerDelay?: number;
}

export function FilteredAnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  filterFn,
  className,
  itemClassName,
  emptyState,
  staggerDelay = 0.05,
}: FilteredAnimatedListProps<T>) {
  const shouldReduceMotion = useReducedMotion();
  const filteredItems = filterFn ? items.filter(filterFn) : items;

  const containerVariants: Variants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      };

  const itemVariants: Variants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: transitions.spring,
        },
        exit: {
          opacity: 0,
          scale: 0.9,
          y: -10,
          transition: { duration: 0.2 },
        },
      };

  if (filteredItems.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <AnimatePresence mode="popLayout">
        {filteredItems.map((item, index) => (
          <motion.div
            key={keyExtractor(item, index)}
            variants={itemVariants}
            layout
            initial="hidden"
            animate="visible"
            exit="exit"
            className={itemClassName}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

// Simple animated item wrapper
interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
  layoutId?: string;
}

export function AnimatedItem({ children, className, layoutId }: AnimatedItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layout={!!layoutId}
      layoutId={layoutId}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
      transition={transitions.spring}
      className={className}
    >
      {children}
    </motion.div>
  );
}
