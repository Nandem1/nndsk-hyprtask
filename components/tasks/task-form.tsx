'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save } from 'lucide-react';
import { useCreateTask } from '@/hooks/use-tasks';
import { useThemeContext } from '@/components/theme-provider-context';
import { PROJECTS, CATEGORIES } from '@/lib/tasks/constants';
import type { TaskPriority, TaskProject, TaskCategory } from '@/types/task';

interface TaskFormProps {
  onTaskAdded: () => void;
  onCancel: () => void;
  maxTasks: number;
  currentTasks: number;
  defaultProject?: TaskProject;
  defaultCategory?: TaskCategory;
}

export function TaskForm({ 
  onTaskAdded, 
  onCancel, 
  maxTasks, 
  currentTasks,
  defaultProject,
  defaultCategory
}: TaskFormProps) {
  const { classes } = useThemeContext();
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('low');
  const [project, setProject] = useState<TaskProject | undefined>(defaultProject);
  const [category, setCategory] = useState<TaskCategory | undefined>(defaultCategory);
  const createTaskMutation = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    if (currentTasks >= maxTasks) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      isCompleted: false,
      isCurrent: false,
      priority,
      createdAt: new Date().toISOString(),
      project,
      category,
    };

    createTaskMutation.mutate(newTask, {
      onSuccess: () => {
        setTitle('');
        onTaskAdded();
      },
    });
  };

  const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Baja', color: 'bg-green-500/20 border-green-500/30' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-500/20 border-yellow-500/30' },
    { value: 'high', label: 'Alta', color: 'bg-red-500/20 border-red-500/30' },
  ];

  return (
    <Card className="glass rounded-xl border border-border/20">
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">New Task</h3>
          <p className="text-xs text-muted-foreground">Add a new task to your list</p>
        </div>
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="relative"
          >
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Task Title
            </label>
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-2.5 border border-border/30 bg-background/30 focus:border-border/50 focus:bg-background/50 transition-all focus:outline-none rounded-lg"
              autoFocus
              maxLength={100}
            />
            {title.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
              >
                {title.length}/100
              </motion.div>
            )}
          </motion.div>

          {/* Proyecto y Categoría estilo comfy */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Project
              </label>
              <select
                value={project || 'general'}
                onChange={(e) => setProject(e.target.value as TaskProject)}
                className="w-full px-3 py-2.5 rounded-lg border border-border/30 bg-background/30 text-sm focus:outline-none focus:border-border/50 focus:bg-background/50 transition-all"
              >
                {PROJECTS.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.label}
                  </option>
                ))}
              </select>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Category
              </label>
              <select
                value={category || 'general'}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2.5 rounded-lg border border-border/30 bg-background/30 text-sm focus:outline-none focus:border-border/50 focus:bg-background/50 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {/* Prioridad estilo comfy */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Priority
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPriority(option.value)}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    priority === option.value
                      ? `${option.color} border-opacity-50 ${classes.shadowHover}`
                      : 'border-border/30 hover:border-border/50 bg-background/30'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Botones mejorados */}
          <div className="flex gap-3 pt-2">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                type="submit"
                disabled={!title.trim() || createTaskMutation.isPending || currentTasks >= maxTasks}
                className={`w-full ${classes.gradientBg} border border-border/30 ${classes.shadowHover} text-base font-medium py-3 rounded-lg transition-all ${
                  !title.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {createTaskMutation.isPending ? (
                  'Saving...'
                ) : (
                  'Create Task'
                )}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-4 py-3 border border-border/30 hover:border-border/50 transition-all rounded-lg glass"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.form>
      </CardContent>
    </Card>
  );
}

