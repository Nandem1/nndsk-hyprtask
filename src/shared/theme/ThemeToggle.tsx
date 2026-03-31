"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { tapGestures } from "@/shared/lib/animations";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-9">
        <Sun className="size-4" />
      </Button>
    );
  }

  return (
    <motion.div {...tapGestures.icon}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="size-9 relative"
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { rotate: -90, opacity: 0 }
              }
              animate={{ rotate: 0, opacity: 1 }}
              exit={
                shouldReduceMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }
              }
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
              <Moon className="size-4" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={
                shouldReduceMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }
              }
              animate={{ rotate: 0, opacity: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { rotate: -90, opacity: 0 }
              }
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
              <Sun className="size-4" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}
