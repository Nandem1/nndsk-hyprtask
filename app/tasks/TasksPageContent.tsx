"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeState } from "@/store/hooks";
import { TaskBoard } from "@/widgets";
import { TaskSidebar, autoArchiveCompletedTasks } from "@/entities/task";
import { Button } from "@/shared/ui/button";
import { Filter } from "lucide-react";

export function TasksPageContent() {
  const { themeClasses } = useThemeState();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Auto-archivar tareas completadas al cargar
  useEffect(() => {
    autoArchiveCompletedTasks();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] relative">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <TaskSidebar />
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-16 bottom-0 z-50 md:hidden"
            >
              <TaskSidebar onClose={() => setSidebarOpen(false)} />
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
              <h1
                className={`text-4xl font-bold tracking-tight mb-2 bg-linear-to-r ${themeClasses.gradient} bg-clip-text text-transparent`}
              >
                Tareas
              </h1>
              <p className="text-muted-foreground">
                Enfocate en lo importante. Maximo 5 tareas activas.
              </p>
            </div>
            {/* Boton filtros movil */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
              aria-label="Abrir filtros"
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
            <TaskBoard />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
