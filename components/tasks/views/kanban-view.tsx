'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Target, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskForm } from '../task-form';
import { getProjectBadgeClasses, getCategoryBadgeClasses } from '@/lib/tasks/constants';
import type { Task } from '@/types/task';
import type { useThemeContext } from '@/components/theme-provider-context';

interface KanbanViewProps {
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

export function KanbanView({
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
}: KanbanViewProps) {
  const todoTasks = tasks.filter(t => !t.isCompleted && !t.isCurrent);
  const activeTask = tasks.find(t => t.isCurrent && !t.isCompleted);
  const doneTasks = tasks.filter(t => t.isCompleted);

  const renderTask = (task: Task, index: number) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group mb-2"
    >
      <div className={`glass rounded-lg border border-border/20 p-3 hover:border-border/40 transition-all ${
        task.isCurrent ? `${classes.borderHover} ${classes.gradientBgSubtle}` : ''
      }`}>
        <div className="flex items-start gap-2">
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
            <p className={`text-sm ${
              task.isCompleted
                ? 'line-through text-muted-foreground'
                : task.isCurrent
                ? `${classes.textPrimary} font-semibold`
                : 'text-foreground'
            }`}>
              {task.title}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
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
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* To Do */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Circle className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">To Do</h3>
          <span className="text-xs text-muted-foreground ml-auto">({todoTasks.length})</span>
        </div>
        <AnimatePresence mode="popLayout">
          {todoTasks.map((task, index) => renderTask(task, index))}
        </AnimatePresence>
      </div>

      {/* Active */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Circle className={`h-4 w-4 ${classes.textPrimary} fill-current`} />
          <h3 className={`text-sm font-semibold ${classes.textPrimary} uppercase`}>Active</h3>
          <span className={`text-xs ${classes.textPrimary} ml-auto`}>({activeTask ? 1 : 0})</span>
        </div>
        <AnimatePresence mode="popLayout">
          {activeTask && renderTask(activeTask, 0)}
        </AnimatePresence>
        {!activeTask && (
          <div className="glass rounded-lg border border-border/20 p-4 text-center text-sm text-muted-foreground">
            No active task
          </div>
        )}
      </div>

      {/* Done */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Check className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">Done</h3>
          <span className="text-xs text-muted-foreground ml-auto">({doneTasks.length})</span>
        </div>
        <AnimatePresence mode="popLayout">
          {doneTasks.map((task, index) => renderTask(task, index))}
        </AnimatePresence>
      </div>

      {/* Formulario */}
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
        <div className="col-span-full">
          <div className="glass rounded-xl border border-border/20 p-8 text-center">
            <p className="text-foreground text-base font-medium mb-1">
              {totalCount === 0 ? 'No tasks yet' : 'No tasks match these filters'}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalCount === 0 ? 'Add your first task to get started' : 'Try changing the filters'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
