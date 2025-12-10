'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { VIEW_MODES } from '@/types/view-mode';
import { useTaskViewMode } from '@/hooks/use-task-view-mode';
import { useThemeContext } from '@/components/theme-provider-context';
import type { TaskViewMode } from '@/types/view-mode';

export function ViewModeSelector() {
  const { viewMode, changeViewMode } = useTaskViewMode();
  const { classes } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);

  const currentMode = VIEW_MODES.find(m => m.id === viewMode) || VIEW_MODES[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg glass border border-border/20 hover:border-border/40 transition-all text-sm font-medium`}
      >
        <LayoutGrid className={`h-4 w-4 ${classes.textPrimary}`} />
        <span className="hidden sm:inline">{currentMode.emoji} {currentMode.name}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 z-50 w-64 glass rounded-xl border border-border/20 p-2 shadow-xl"
          >
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2 uppercase tracking-wider">
              View Mode
            </div>
            <div className="space-y-1">
              {VIEW_MODES.map((mode) => (
                <motion.button
                  key={mode.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    changeViewMode(mode.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                    viewMode === mode.id
                      ? `glass border ${classes.borderHover} ${classes.shadowHover}`
                      : 'border border-transparent hover:glass hover:border-border/30'
                  }`}
                >
                  <span className="text-lg">{mode.emoji}</span>
                  <div className="flex-1">
                    <div className={`font-medium ${viewMode === mode.id ? classes.textPrimary : 'text-foreground'}`}>
                      {mode.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {mode.description}
                    </div>
                  </div>
                  {viewMode === mode.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-2 h-2 rounded-full ${classes.gradientBg}`}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
