'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskForm } from '../task-form';
import { getProjectBadgeClasses, getCategoryBadgeClasses } from '@/lib/tasks/constants';
import type { Task } from '@/types/task';
import type { useThemeContext } from '@/components/theme-provider-context';

interface StickyViewProps {
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

// Rotaciones aleatorias sutiles para cada tarea
const getRotation = (index: number) => {
  const rotations = [-1.5, 1, -1, 0.5, -0.5, 1.5, -1.2, 0.8];
  return rotations[index % rotations.length];
};

export function StickyView({
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
}: StickyViewProps) {
  const sortedTasks = tasks.sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => {
          const rotation = getRotation(index);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.8, rotate: rotation - 5 }}
              animate={{ opacity: 1, scale: 1, rotate: rotation }}
              exit={{ opacity: 0, scale: 0.8, rotate: rotation + 5 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              className="group"
            >
              <div className={`glass rounded-xl border border-border/20 p-4 h-full flex flex-col shadow-lg ${
                task.isCurrent ? `${classes.borderHover} ${classes.gradientBgSubtle}` : ''
              }`}>
                <div className="flex items-start gap-2 mb-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggle(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                      task.isCompleted
                        ? `${classes.borderHover} ${classes.gradientBgSubtle}`
                        : 'border-border/40'
                    }`}
                  >
                    {task.isCompleted && (
                      <Check className={`h-3 w-3 ${classes.textPrimary}`} />
                    )}
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    {task.isCurrent && !task.isCompleted && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${classes.gradientBgSubtle} ${classes.textPrimary} font-medium mb-1 inline-block`}>
                        Active
                      </span>
                    )}
                    <p className={`text-sm font-medium ${
                      task.isCompleted
                        ? 'line-through text-muted-foreground'
                        : task.isCurrent
                        ? `${classes.textPrimary} font-semibold`
                        : 'text-foreground'
                    }`}>
                      {task.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mt-auto">
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
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            </motion.div>
          );
        })}
      </AnimatePresence>

      {showForm && canAddTask && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-full"
        >
          <TaskForm {...formProps} />
        </motion.div>
      )}

      {!showForm && canAddTask && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="col-span-full"
        >
          <Button
            onClick={onShowForm}
            className={`w-full ${classes.gradientBg} border border-border/30 ${classes.shadowHover} transition-all text-sm font-medium py-3 rounded-xl`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </motion.div>
      )}

      {tasks.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full"
        >
          <div className="glass rounded-xl border border-border/20 p-8 text-center">
            <p className="text-foreground text-base font-medium mb-1">
              {totalCount === 0 ? 'No tasks yet' : 'No tasks match these filters'}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalCount === 0 ? 'Add your first task to get started' : 'Try changing the filters'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
