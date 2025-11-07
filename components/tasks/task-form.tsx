'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save } from 'lucide-react';
import { useCreateTask } from '@/hooks/use-tasks';
import { useThemeContext } from '@/components/theme-provider-context';
import type { TaskPriority } from '@/types/task';

interface TaskFormProps {
  onTaskAdded: () => void;
  onCancel: () => void;
  maxTasks: number;
  currentTasks: number;
}

export function TaskForm({ onTaskAdded, onCancel, maxTasks, currentTasks }: TaskFormProps) {
  const { classes } = useThemeContext();
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('low');
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
    <Card className={`border ${classes.border} bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm`}>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="¿Qué necesitas hacer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            autoFocus
            maxLength={100}
          />

          {/* Prioridad */}
          <div className="flex gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPriority(option.value)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  priority === option.value
                    ? `${option.color} border-opacity-50`
                    : 'border-border hover:border-border/50 bg-muted/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                type="submit"
                disabled={!title.trim() || createTaskMutation.isPending || currentTasks >= maxTasks}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {createTaskMutation.isPending ? 'Guardando...' : 'Agregar'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

