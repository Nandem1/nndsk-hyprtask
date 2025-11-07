'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, Trash2, AlertCircle, Target } from 'lucide-react';
import { getTaskSettings } from '@/lib/tasks/storage';
import { useActiveTasks, useToggleTask, useDeleteTask, useSetCurrentTask } from '@/hooks/use-tasks';
import { useThemeContext } from '@/components/theme-provider-context';
import { TaskForm } from './task-form';

export function TaskList() {
  const { classes } = useThemeContext();
  const { data: tasks = [], isLoading } = useActiveTasks();
  const [maxTasks, setMaxTasks] = useState<number>(5);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const toggleTaskMutation = useToggleTask();
  const deleteTaskMutation = useDeleteTask();
  const setCurrentTaskMutation = useSetCurrentTask();

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getTaskSettings();
      setMaxTasks(settings.maxActiveTasks);
    };
    loadSettings();
  }, []);

  const handleToggle = (id: string) => {
    toggleTaskMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleTaskAdded = () => {
    setShowForm(false);
  };

  const handleSetCurrent = (id: string) => {
    setCurrentTaskMutation.mutate(id);
  };

  const canAddTask = tasks.length < maxTasks;
  const remainingSlots = maxTasks - tasks.length;

  return (
    <div className="space-y-4">
      {/* Header con contador */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tareas de Hoy</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.length} de {maxTasks} tareas activas
          </p>
        </div>
        {!canAddTask && (
          <div className="flex items-center gap-2 text-sm text-yellow-500">
            <AlertCircle className="h-4 w-4" />
            <span>Límite alcanzado</span>
          </div>
        )}
      </div>

      {/* Lista de tareas */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {tasks
            .sort((a, b) => {
              // Current task siempre primero
              if (a.isCurrent && !b.isCurrent) return -1;
              if (!a.isCurrent && b.isCurrent) return 1;
              // Luego por prioridad
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            })
            .map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <TaskItem
                  task={task}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onSetCurrent={handleSetCurrent}
                  classes={classes}
                />
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Formulario de nueva tarea */}
        {showForm && canAddTask && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <TaskForm
              onTaskAdded={handleTaskAdded}
              onCancel={() => setShowForm(false)}
              maxTasks={maxTasks}
              currentTasks={tasks.length}
            />
          </motion.div>
        )}

        {/* Botón agregar */}
        {!showForm && canAddTask && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowForm(true)}
              className={`w-full bg-gradient-to-r ${classes.gradientBg} border ${classes.border}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Tarea ({remainingSlots} espacios)
            </Button>
          </motion.div>
        )}

        {/* Mensaje cuando no hay tareas */}
        {tasks.length === 0 && !showForm && (
          <Card className={`border ${classes.border} bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm`}>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-2">
                ¡No hay tareas pendientes!
              </p>
              <p className="text-sm text-muted-foreground/60">
                Agrega tu primera tarea para comenzar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  classes: ReturnType<typeof useThemeContext>['classes'];
}

function TaskItem({ task, onToggle, onDelete, onSetCurrent, classes }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [justCompleted, setJustCompleted] = useState<boolean>(false);

  const priorityColors = {
    low: 'border-green-500/30 bg-green-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    high: 'border-red-500/30 bg-red-500/5',
  };

  const handleToggle = async () => {
    if (!task.isCompleted) {
      setJustCompleted(true);
      // Auto-eliminar después de 2 segundos si está completada
      setTimeout(() => {
        onDelete(task.id);
      }, 2000);
    }
    onToggle(task.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 300);
  };

  return (
    <motion.div
      initial={false}
      animate={
        isDeleting
          ? { opacity: 0, x: -100, scale: 0.8 }
          : justCompleted
          ? { opacity: 1, scale: 1.05, rotate: [0, 2, -2, 0] }
          : { opacity: 1, x: 0, scale: 1 }
      }
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`border ${classes.border} bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${classes.shadowHover} ${
          justCompleted
            ? 'ring-2 ring-green-500/50'
            : task.isCurrent
            ? 'ring-2 ring-green-500/50 border-green-500/50 bg-green-500/5'
            : ''
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Checkbox */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggle}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                task.isCompleted
                  ? `bg-gradient-to-r ${classes.gradient} border-transparent`
                  : `${classes.border} hover:${classes.borderHover}`
              }`}
            >
              {task.isCompleted && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </motion.button>

            {/* Título */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {task.isCurrent && !task.isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-xs text-green-500 font-semibold"
                  >
                    <Target className="h-3 w-3" />
                    <span>ACTUAL</span>
                  </motion.div>
                )}
                <motion.p
                  animate={
                    task.isCompleted
                      ? { opacity: 0.5, scale: 0.98 }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={{ duration: 0.2 }}
                  className={`font-medium ${
                    task.isCompleted
                      ? 'line-through text-muted-foreground'
                      : task.isCurrent
                      ? 'text-green-300 font-semibold'
                      : 'text-foreground'
                  }`}
                >
                  {task.title}
                </motion.p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {task.priority !== 'low' && !task.isCompleted && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}
                  >
                    {task.priority === 'high' ? 'Alta' : 'Media'}
                  </span>
                )}
                {justCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-green-500 font-semibold"
                  >
                    ¡Completada! 🎉
                  </motion.div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-1">
              {!task.isCurrent && !task.isCompleted && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSetCurrent(task.id)}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-green-500/10 text-muted-foreground hover:text-green-500 transition-colors"
                  title="Marcar como tarea actual"
                >
                  <Target className="h-4 w-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

