"use client";

import { useEffect, useRef, useCallback } from "react";
import { useThemeState } from "@/store/hooks";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface ParticlesBackgroundProps {
  density?: "low" | "medium" | "high";
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

export function ParticlesBackground({
  density = "medium",
  speed = "normal",
  className,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const { themeClasses } = useThemeState();
  const isVisibleRef = useRef(true);
  const lastFrameTimeRef = useRef(0);

  // Reducido: ahora medium = 15, high = 25 (antes 50 y 100)
  const particleCount = {
    low: 8,
    medium: 15,
    high: 25,
  }[density];

  const speedMultiplier = {
    slow: 0.3,
    normal: 0.6,
    fast: 1.0,
  }[speed];

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      const baseColor = themeClasses.particleColor || "#60A5FA";

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * speedMultiplier,
          speedY: (Math.random() - 0.5) * speedMultiplier - 0.2,
          opacity: Math.random() * 0.5 + 0.2,
          color: baseColor,
        });
      }

      return particles;
    },
    [particleCount, speedMultiplier, themeClasses.particleColor]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // IntersectionObserver para pausar cuando no es visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Visibility API para pausar cuando el tab no está activo
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limitar DPR a 2
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      // Reinitialize particles on resize
      particlesRef.current = initParticles(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Pre-calcular gradientes para reutilizar
    const gradientCache = new Map<string, CanvasGradient>();

    const getGradient = (color: string, opacity: number, size: number, x: number, y: number) => {
      const key = `${color}-${opacity}-${size}`;
      let gradient = gradientCache.get(key);
      if (!gradient) {
        gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, "0")}`);
        gradient.addColorStop(1, "transparent");
        gradientCache.set(key, gradient);
      }
      return gradient;
    };

    const animate = (timestamp: number) => {
      // Throttling: limitar a 30fps (33ms entre frames)
      if (timestamp - lastFrameTimeRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      // Pausar si no es visible
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;

        // Draw particle with glow - usar gradiente cacheado
        const gradient = getGradient(particle.color, particle.opacity, particle.size, particle.x, particle.y);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 200).toString(16).padStart(2, "0")}`;
        ctx.fill();
      });

      // ELIMINADO: Algoritmo O(n²) de conexiones entre partículas
      // Esto reducía significativamente el rendimiento

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
