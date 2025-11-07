'use client';

import { motion } from 'framer-motion';
import LayoutWithHeader from '../layout-with-header';
import { useThemeContext } from '@/components/theme-provider-context';
import { TaskList } from '@/components/tasks/task-list';
import { useEffect } from 'react';
import { autoArchiveCompletedTasks } from '@/lib/tasks/storage';

function TasksPageContent() {
  const { classes } = useThemeContext();
  
  // Auto-archivar tareas completadas al cargar
  useEffect(() => {
    autoArchiveCompletedTasks();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="mb-8"
      >
        <h1 className={`text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r ${classes.gradient} bg-clip-text text-transparent`}>
          Tareas
        </h1>
        <p className="text-muted-foreground">
          Enfócate en lo importante. Máximo 5 tareas activas.
        </p>
      </motion.div>

      {/* Lista de tareas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      >
        <TaskList />
      </motion.div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <LayoutWithHeader>
      <TasksPageContent />
    </LayoutWithHeader>
  );
}

