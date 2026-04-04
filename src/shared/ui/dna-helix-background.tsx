"use client";

import { useEffect, useRef } from "react";

interface DNAHelixBackgroundProps {
  speed?: "slow" | "normal" | "fast";
  className?: string;
  helixColor?: string;
  blendMode?: "screen" | "normal";
}

type Phase = "fadein" | "visible" | "fadeout" | "dead";

interface HelixInstance {
  x: number;
  y: number;
  angle: number;
  rotSpeed: number;
  rotAccel: number;
  scale: number;
  t: number;
  phase: Phase;
  fadeTimer: number;
  visibleTimer: number;
  fadeDuration: number;
  visibleDuration: number;
  tilt: number;
  maxAlpha: number;
  driftAmpX: number;
  driftAmpY: number;
  driftFreq: number;
  driftPhase: number;
  driftTimer: number;
}

const CANVAS_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};

const MAX_HELICES = 6;
const FADE_MIN = 0.4;
const FADE_MAX = 0.8;
const VIS_MIN = 1.0;
const VIS_MAX = 2.5;
const ROT_MIN = 0.4;
const ROT_MAX = 1.1;
const SCALE_MIN = 0.75;
const SCALE_MAX = 1.2;
const SPAWN_MIN = 0.6;
const SPAWN_MAX = 1.5;
const MARGIN = 80;

const PAIRS = 16;
const RADIUS_BASE = 52;
const TOTAL_HEIGHT_BASE = 220;
const STRAND_WIDTH_BASE = 2.5;
const CONNECTOR_WIDTH_BASE = 3.5;
const GLOW_BLUR = 10;
const ALPHA_FRONT = 1.0;
const ALPHA_BACK = 0.25;

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}


function rgba(rgb: { r: number; g: number; b: number }, a: number): string {
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${a.toFixed(3)})`;
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function spawnHelix(w: number, h: number): HelixInstance {
  return {
    x: rand(MARGIN, w - MARGIN),
    y: rand(MARGIN, h - MARGIN),
    angle: rand(0, Math.PI * 2),
    rotSpeed: rand(ROT_MIN, ROT_MAX) * (Math.random() > 0.5 ? 1 : -1),
    rotAccel: rand(-0.06, 0.06),
    scale: rand(SCALE_MIN, SCALE_MAX),
    t: 0,
    phase: "fadein",
    fadeTimer: 0,
    visibleTimer: 0,
    fadeDuration: rand(FADE_MIN, FADE_MAX),
    visibleDuration: rand(VIS_MIN, VIS_MAX),
    tilt: Math.PI * 0.15 + Math.random() * Math.PI * 0.7,
    maxAlpha: rand(0.20, 0.48),
    driftAmpX: rand(6, 14),
    driftAmpY: rand(6, 14),
    driftFreq: rand(0.18, 0.38),
    driftPhase: rand(0, Math.PI * 2),
    driftTimer: 0,
  };
}

function updateHelix(h: HelixInstance, dt: number): void {
  h.angle += h.rotSpeed * dt;
  h.rotSpeed += h.rotAccel * dt;
  h.rotSpeed = Math.max(ROT_MIN * 0.4, Math.min(ROT_MAX * 1.3,
    Math.abs(h.rotSpeed))) * Math.sign(h.rotSpeed);

  if (Math.abs(h.rotSpeed) < ROT_MIN * 0.5) {
    h.rotAccel *= -1;
  }

  h.driftTimer += dt;

  switch (h.phase) {
    case "fadein":
      h.fadeTimer += dt;
      h.t = Math.min(1, h.fadeTimer / h.fadeDuration);
      if (h.t >= 1) {
        h.t = 1;
        h.phase = "visible";
      }
      break;
    case "visible":
      h.visibleTimer += dt;
      if (h.visibleTimer >= h.visibleDuration) {
        h.phase = "fadeout";
        h.fadeTimer = 0;
      }
      break;
    case "fadeout":
      h.fadeTimer += dt;
      h.t = Math.max(0, 1 - h.fadeTimer / h.fadeDuration);
      if (h.t <= 0) {
        h.t = 0;
        h.phase = "dead";
      }
      break;
    case "dead":
      break;
  }
}

interface Seg {
  x1: number;
  y1: number;
  z1: number;
  x2: number;
  y2: number;
  z2: number;
  strand: "A" | "B";
}

interface Conn {
  xA: number;
  xB: number;
  y: number;
  z: number;
}

function drawHelix(
  ctx: CanvasRenderingContext2D,
  angle: number,
  scale: number,
  rgbA: { r: number; g: number; b: number },
  rgbB: { r: number; g: number; b: number },
): void {
  const radius = RADIUS_BASE * scale;
  const totalH = TOTAL_HEIGHT_BASE * scale;
  const halfH = totalH / 2;
  const spacing = totalH / (PAIRS - 1);

  const backSegs: Seg[] = [];
  const frontSegs: Seg[] = [];
  const backConns: Conn[] = [];
  const frontConns: Conn[] = [];

  for (let i = 0; i < PAIRS; i++) {
    const y = -halfH + i * spacing;
    const t = i / PAIRS;
    const angleA = t * Math.PI * 2 + angle;
    const angleB = angleA + Math.PI;

    const xA = radius * Math.sin(angleA);
    const xB = radius * Math.sin(angleB);
    const zA = Math.cos(angleA);
    const zB = Math.cos(angleB);

    if (i < PAIRS - 1) {
      const yNext = -halfH + (i + 1) * spacing;
      const tNext = (i + 1) / PAIRS;
      const nextAngleA = tNext * Math.PI * 2 + angle;
      const nextAngleB = nextAngleA + Math.PI;

      const xAn = radius * Math.sin(nextAngleA);
      const xBn = radius * Math.sin(nextAngleB);
      const zAn = Math.cos(nextAngleA);
      const zBn = Math.cos(nextAngleB);

      const segA: Seg = { x1: xA, y1: y, z1: zA, x2: xAn, y2: yNext, z2: zAn, strand: "A" };
      const segB: Seg = { x1: xB, y1: y, z1: zB, x2: xBn, y2: yNext, z2: zBn, strand: "B" };

      const avgZA = (zA + zAn) / 2;
      const avgZB = (zB + zBn) / 2;

      if (avgZA < 0) backSegs.push(segA); else frontSegs.push(segA);
      if (avgZB < 0) backSegs.push(segB); else frontSegs.push(segB);
    }

    const connZ = (zA + zB) / 2;
    const conn: Conn = { xA, xB, y, z: connZ };
    if (connZ < 0) backConns.push(conn); else frontConns.push(conn);
  }

  const drawSeg = (s: Seg) => {
    const avgZ = (s.z1 + s.z2) / 2;
    const normZ = (avgZ + 1) / 2;
    const a = ALPHA_BACK + normZ * (ALPHA_FRONT - ALPHA_BACK);
    const lw = (STRAND_WIDTH_BASE + STRAND_WIDTH_BASE * normZ) * scale;
    const color = s.strand === "A" ? rgbA : rgbB;

    if (normZ > 0.5) {
      ctx.shadowBlur = GLOW_BLUR * (normZ - 0.5) * 2 * scale;
      ctx.shadowColor = rgba(color, 0.6);
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.strokeStyle = rgba(color, a);
    ctx.stroke();
  };

  const drawConn = (c: Conn) => {
    const normZ = (c.z + 1) / 2;
    const lw = (CONNECTOR_WIDTH_BASE + 2 * normZ) * scale;

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(c.xA, c.y);
    ctx.lineTo(c.xB, c.y);
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.strokeStyle = rgba(rgbA, 0.18 + normZ * 0.22);
    ctx.stroke();
  };

  ctx.shadowBlur = 0;

  for (const s of backSegs) drawSeg(s);
  for (const c of backConns) drawConn(c);
  for (const s of frontSegs) drawSeg(s);
  for (const c of frontConns) drawConn(c);

  ctx.shadowBlur = 0;
}

function drawHelixGlow(
  ctx: CanvasRenderingContext2D,
  angle: number,
  scale: number,
  rgb: { r: number; g: number; b: number },
): void {
  const radius = RADIUS_BASE * scale;
  const totalH = TOTAL_HEIGHT_BASE * scale;
  const halfH = totalH / 2;
  const spacing = totalH / (PAIRS - 1);

  for (let i = 0; i < PAIRS - 1; i++) {
    const y = -halfH + i * spacing;
    const yNext = -halfH + (i + 1) * spacing;
    const t = i / PAIRS;
    const tNext = (i + 1) / PAIRS;

    const angleA = t * Math.PI * 2 + angle;
    const angleB = angleA + Math.PI;
    const nextAngleA = tNext * Math.PI * 2 + angle;
    const nextAngleB = nextAngleA + Math.PI;

    const pairs = [
      { x1: radius * Math.sin(angleA), y1: y, x2: radius * Math.sin(nextAngleA), y2: yNext, z: (Math.cos(angleA) + Math.cos(nextAngleA)) / 2 },
      { x1: radius * Math.sin(angleB), y1: y, x2: radius * Math.sin(nextAngleB), y2: yNext, z: (Math.cos(angleB) + Math.cos(nextAngleB)) / 2 },
    ];

    for (const p of pairs) {
      const normZ = (p.z + 1) / 2;
      if (normZ <= 0.55) continue;

      ctx.shadowBlur = 18 * normZ * scale;
      ctx.shadowColor = rgba(rgb, 0.4);
      ctx.strokeStyle = rgba(rgb, 0.06);
      ctx.lineWidth = STRAND_WIDTH_BASE * 2 * scale;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.x1, p.y1);
      ctx.lineTo(p.x2, p.y2);
      ctx.stroke();
    }
  }

  ctx.shadowBlur = 0;
}

export function DNAHelixBackground({
  speed = "slow",
  className,
  helixColor = "#60A5FA",
  blendMode = "screen",
}: DNAHelixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const isRunningRef = useRef(false);
  const lastTsRef = useRef(0);
  const helicesRef = useRef<HelixInstance[]>([]);
  const spawnTimerRef = useRef(0);
  const nextIntervalRef = useRef(rand(SPAWN_MIN, SPAWN_MAX));
  const sizeRef = useRef({ width: 0, height: 0 });
  const dprRef = useRef(1);

  const speedMultiplier = { slow: 0.6, normal: 1.0, fast: 1.5 }[speed];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgbA = hexToRgb(helixColor);
    const rgbB = rgbA;
    const useScreenBlend = blendMode === "screen";

    const startLoop = () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      lastTsRef.current = 0;

      const loop = (ts: number) => {
        if (!isRunningRef.current) return;

        if (!lastTsRef.current) {
          lastTsRef.current = ts;
          animationRef.current = requestAnimationFrame(loop);
          return;
        }

        if (!isVisibleRef.current) {
          isRunningRef.current = false;
          return;
        }

        let dt = (ts - lastTsRef.current) / 1000;
        dt = Math.min(dt, 0.05);
        dt *= speedMultiplier;
        lastTsRef.current = ts;

        const { width, height } = sizeRef.current;
        if (width === 0 || height === 0) {
          animationRef.current = requestAnimationFrame(loop);
          return;
        }

        const helices = helicesRef.current;

        spawnTimerRef.current += dt;
        if (spawnTimerRef.current >= nextIntervalRef.current) {
          const alive = helices.filter((h) => h.phase !== "dead").length;
          if (alive < MAX_HELICES) {
            helices.push(spawnHelix(width, height));
          }
          spawnTimerRef.current = 0;
          nextIntervalRef.current = rand(SPAWN_MIN, SPAWN_MAX);
        }

        for (const h of helices) updateHelix(h, dt);

        helicesRef.current = helices.filter((h) => h.phase !== "dead");

        const dpr = dprRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        for (const h of helicesRef.current) {
          const dx = Math.sin(h.driftTimer * h.driftFreq + h.driftPhase) * h.driftAmpX;
          const dy = Math.cos(h.driftTimer * h.driftFreq + h.driftPhase * 1.3) * h.driftAmpY;
          const eased = easeInOutQuad(h.t);

          if (useScreenBlend) ctx.globalCompositeOperation = "screen";

          ctx.save();
          ctx.translate(h.x + dx, h.y + dy);
          ctx.rotate(h.tilt);
          ctx.globalAlpha = eased * h.maxAlpha * 1.8;
          drawHelixGlow(ctx, h.angle, h.scale, rgbA);
          ctx.restore();

          ctx.globalCompositeOperation = "source-over";

          ctx.save();
          ctx.translate(h.x + dx, h.y + dy);
          ctx.rotate(h.tilt);
          ctx.globalAlpha = eased * h.maxAlpha;
          drawHelix(ctx, h.angle, h.scale, rgbA, rgbB);
          ctx.restore();
        }

        ctx.restore();
        animationRef.current = requestAnimationFrame(loop);
      };

      animationRef.current = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      isRunningRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) startLoop();
        });
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
      if (document.visibilityState === "visible") startLoop();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      dprRef.current = dpr;
      sizeRef.current = { width: rect.width, height: rect.height };
    };

    resize();
    window.addEventListener("resize", resize);
    startLoop();

    return () => {
      stopLoop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, [speedMultiplier, helixColor, blendMode]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={CANVAS_STYLE}
    />
  );
}
