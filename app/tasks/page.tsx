'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LayoutWithHeader from '../layout-with-header';
import { useThemeContext } from '@/components/theme-provider-context';
import { ViewModeProvider } from '@/components/tasks/view-mode-provider';
import { TaskList } from '@/components/tasks/task-list';
import { Sidebar } from '@/components/tasks/sidebar';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { autoArchiveCompletedTasks } from '@/lib/tasks/storage';
import type { TaskProject, TaskCategory } from '@/types/task';

function TasksPageContent() {
  const { classes } = useThemeContext();
  const [selectedProject, setSelectedProject] = useState<TaskProject | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
  // Auto-archivar tareas completadas al cargar
  useEffect(() => {
    autoArchiveCompletedTasks();
  }, []);
  
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] relative">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar
          selectedProject={selectedProject}
          selectedCategory={selectedCategory}
          onProjectChange={setSelectedProject}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-16 bottom-0 z-50 md:hidden"
            >
              <Sidebar
                selectedProject={selectedProject}
                selectedCategory={selectedCategory}
                onProjectChange={(project) => {
                  setSelectedProject(project);
                  setSidebarOpen(false);
                }}
                onCategoryChange={(category) => {
                  setSelectedCategory(category);
                  setSidebarOpen(false);
                }}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className={`text-4xl font-bold tracking-tight mb-2 bg-linear-to-r ${classes.gradient} bg-clip-text text-transparent`}>
                Tareas
              </h1>
              <p className="text-muted-foreground">
                Enfócate en lo importante. Máximo 5 tareas activas.
              </p>
            </div>
            {/* Botón filtros móvil */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Lista de tareas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          >
            <TaskList 
              selectedProject={selectedProject}
              selectedCategory={selectedCategory}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <ViewModeProvider>
      <LayoutWithHeader>
        <TasksPageContent />
      </LayoutWithHeader>
    </ViewModeProvider>
  );
}

