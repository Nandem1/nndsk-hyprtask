'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskForm } from '../task-form';
import { getProjectBadgeClasses, getCategoryBadgeClasses } from '@/lib/tasks/constants';
import type { Task } from '@/types/task';
import type { useThemeContext } from '@/components/theme-provider-context';

interface CodeNotesViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  classes: ReturnType<typeof useThemeContext>['classes'];
  showForm: boolean;
  canAddTask: boolean;
  onShowForm: () => void;
  formProps: any;
  totalCount: number;
  filteredCount: number;
}

export function CodeNotesView({
  tasks,
  onToggle,
  onDelete,
  onSetCurrent,
  classes,
  showForm,
  canAddTask,
  onShowForm,
  formProps,
  totalCount,
  filteredCount,
}: CodeNotesViewProps) {
  const sortedTasks = tasks.sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="space-y-1 font-mono text-sm">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group"
          >
            <div className={`glass rounded border border-border/20 p-3 hover:border-border/40 transition-all ${
              task.isCurrent ? `${classes.borderHover} ${classes.gradientBgSubtle}` : ''
            }`}>
              <div className="flex items-start gap-2">
                <span className={`text-muted-foreground ${task.isCurrent ? classes.textPrimary : ''}`}>
                  {task.isCurrent ? '//' : '//'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onToggle(task.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        task.isCompleted
                          ? `${classes.borderHover} ${classes.gradientBgSubtle}`
                          : 'border-border/40'
                      }`}
                    >
                      {task.isCompleted && (
                        <Check className={`h-2.5 w-2.5 ${classes.textPrimary}`} />
                      )}
                    </motion.button>
                    <span className={`text-muted-foreground ${task.isCurrent ? classes.textPrimary : ''}`}>
                      TODO:
                    </span>
                    <p className={`${
                      task.isCompleted
                        ? 'line-through text-muted-foreground'
                        : task.isCurrent
                        ? `${classes.textPrimary} font-semibold`
                        : 'text-foreground'
                    }`}>
                      {task.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap ml-6">
                    {task.project && task.project !== 'general' && !task.isCompleted && (
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${getProjectBadgeClasses(task.project)}`}>
                        {task.project}
                      </span>
                    )}
                    {task.category && task.category !== 'general' && !task.isCompleted && (
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${getCategoryBadgeClasses(task.category)}`}>
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!task.isCurrent && !task.isCompleted && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onSetCurrent(task.id)}
                      className="p-1 rounded glass border border-border/20"
                    >
                      <Target className={`h-3 w-3 ${classes.textPrimary}`} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(task.id)}
                    className="p-1 rounded glass border border-border/20 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {showForm && canAddTask && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4"
        >
          <TaskForm {...formProps} />
        </motion.div>
      )}

      {!showForm && canAddTask && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-4"
        >
          <Button
            onClick={onShowForm}
            className={`w-full ${classes.gradientBg} border border-border/30 ${classes.shadowHover} transition-all text-sm font-medium py-3 rounded-lg font-mono`}
          >
            <Plus className="h-4 w-4 mr-2" />
            // Add Task
          </Button>
        </motion.div>
      )}

      {tasks.length === 0 && !showForm && (
        <div className="glass rounded border border-border/20 p-8 text-center font-mono">
          <p className="text-foreground text-base font-medium mb-1">
            {totalCount === 0 ? '// No tasks yet' : '// No tasks match these filters'}
          </p>
          <p className="text-sm text-muted-foreground">
            {totalCount === 0 ? '// Add your first task to get started' : '// Try changing the filters'}
          </p>
        </div>
      )}
    </div>
  );
}
