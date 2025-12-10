'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3x3, X } from 'lucide-react';
import { useThemeContext } from '@/components/theme-provider-context';
import { useActiveTasks } from '@/hooks/use-tasks';
import { PROJECTS as PROJECTS_CONFIG, CATEGORIES as CATEGORIES_CONFIG } from '@/lib/tasks/constants';
import type { TaskProject, TaskCategory } from '@/types/task';

interface SidebarProps {
  selectedProject: TaskProject | 'all';
  selectedCategory: TaskCategory | 'all';
  onProjectChange: (project: TaskProject | 'all') => void;
  onCategoryChange: (category: TaskCategory | 'all') => void;
}

// Agregar opción "All" a los proyectos y categorías
const PROJECTS = [
  { id: 'all' as const, label: 'All', icon: Grid3x3, color: 'text-muted-foreground' },
  ...PROJECTS_CONFIG,
];

const CATEGORIES = [
  { id: 'all' as const, label: 'All', icon: Grid3x3, color: 'text-muted-foreground' },
  ...CATEGORIES_CONFIG,
];

interface SidebarPropsWithClose extends SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ 
  selectedProject, 
  selectedCategory, 
  onProjectChange, 
  onCategoryChange,
  onClose
}: SidebarPropsWithClose) {
  const { classes } = useThemeContext();
  const { data: tasks = [] } = useActiveTasks();

  // Calcular contadores por proyecto
  const projectCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tasks.length };
    PROJECTS_CONFIG.forEach(p => {
      counts[p.id] = tasks.filter(t => t.project === p.id).length;
    });
    return counts;
  }, [tasks]);

  // Calcular contadores por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tasks.length };
    CATEGORIES_CONFIG.forEach(c => {
      counts[c.id] = tasks.filter(t => t.category === c.id).length;
    });
    return counts;
  }, [tasks]);

  return (
    <aside className="w-80 border-r border-border/20 glass-dark h-full overflow-y-auto relative">
      <div className="p-5 space-y-6 relative z-10">
        {/* Botón cerrar móvil - estilo terminal */}
        {onClose && (
          <div className="flex justify-end mb-4 md:hidden">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`p-2 rounded border-2 ${classes.border} hover:${classes.borderHover} transition-all font-mono`}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        )}

        {/* Header con estadísticas - estilo comfy */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border border-border/20"
        >
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <span>Active Tasks</span>
          </div>
          <motion.div
            key={tasks.length}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-3xl font-bold ${classes.textPrimary}`}
          >
            {tasks.length}
          </motion.div>
        </motion.div>

        {/* Proyectos - estilo comfy */}
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-3 px-2 uppercase tracking-wider">
            Projects
          </div>
          <div className="space-y-1.5">
            {PROJECTS.map((project, index) => {
              const Icon = project.icon;
              const isSelected = selectedProject === project.id;
              const count = projectCounts[project.id] || 0;
              
              return (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onProjectChange(project.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group ${
                    isSelected
                      ? `glass border ${classes.borderHover} ${classes.shadowHover}`
                      : `border border-transparent hover:glass hover:border-border/30`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isSelected ? classes.textPrimary : 'text-muted-foreground'}`} />
                    <span className={isSelected ? `${classes.textPrimary} font-medium` : 'text-foreground'}>
                      {project.label}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {count > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        key={count}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isSelected
                            ? `${classes.textPrimary} bg-primary/20`
                            : 'text-muted-foreground bg-muted/50'
                        }`}
                      >
                        {count}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Categorías - estilo comfy */}
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-3 px-2 uppercase tracking-wider">
            Categories
          </div>
          <div className="space-y-1.5">
            {CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              const count = categoryCounts[category.id] || 0;
              
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + PROJECTS.length) * 0.03 }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group ${
                    isSelected
                      ? `glass border ${classes.borderHover} ${classes.shadowHover}`
                      : `border border-transparent hover:glass hover:border-border/30`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isSelected ? classes.textPrimary : 'text-muted-foreground'}`} />
                    <span className={isSelected ? `${classes.textPrimary} font-medium` : 'text-foreground'}>
                      {category.label}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {count > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        key={count}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isSelected
                            ? `${classes.textPrimary} bg-primary/20`
                            : 'text-muted-foreground bg-muted/50'
                        }`}
                      >
                        {count}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
