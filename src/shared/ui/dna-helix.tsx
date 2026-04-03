"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface DNAHelixProps {
  isCompleted: boolean;
  isActive: boolean;
  delay?: number;
  className?: string;
}

const HELIX_WIDTH = 40;
const HELIX_HEIGHT = 64;
const AMPLITUDE = 12;
const CENTER_X = HELIX_WIDTH / 2;
const NUM_RUNGS = 5;
const SVG_NS = "http://www.w3.org/2000/svg";

function buildStrandPath(sign: 1 | -1): string {
  const points = 20;
  const coords: string[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const y = t * HELIX_HEIGHT;
    const x = CENTER_X + sign * AMPLITUDE * Math.sin(t * Math.PI * 2);
    coords.push(i === 0 ? `M ${x.toFixed(2)},${y.toFixed(2)}` : `L ${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return coords.join(" ");
}

function getRungPositions(): { x1: number; x2: number; y: number }[] {
  const rungs: { x1: number; x2: number; y: number }[] = [];
  for (let i = 1; i <= NUM_RUNGS; i++) {
    const t = i / (NUM_RUNGS + 1);
    const y = t * HELIX_HEIGHT;
    const offset = AMPLITUDE * Math.sin(t * Math.PI * 2);
    rungs.push({
      x1: CENTER_X - Math.abs(offset),
      x2: CENTER_X + Math.abs(offset),
      y,
    });
  }
  return rungs;
}

const STRAND_A_PATH = buildStrandPath(1);
const STRAND_B_PATH = buildStrandPath(-1);
const RUNG_POSITIONS = getRungPositions();

const particleConfig = [
  { path: STRAND_A_PATH, delay: 0 },
  { path: STRAND_B_PATH, delay: 0.6 },
  { path: STRAND_A_PATH, delay: 1.2 },
];

function HelixParticle({ path, delay }: { path: string; delay: number }) {
  return (
    <motion.circle
      r={2}
      fill="currentColor"
      className="text-primary"
      opacity={0.9}
      filter="url(#dna-glow)"
    >
      <animateMotion
        dur="3s"
        repeatCount="indefinite"
        begin={`${delay}s`}
        path={path}
      />
    </motion.circle>
  );
}

export const DNAHelix = memo(function DNAHelix({
  isCompleted,
  isActive,
  delay = 0,
  className,
}: DNAHelixProps) {
  const shouldReduceMotion = useReducedMotion();

  const strandColor = isCompleted
    ? "hsl(var(--primary))"
    : isActive
      ? "hsl(var(--primary))"
      : "hsl(var(--border))";

  const rungColor = isCompleted
    ? "hsl(var(--primary) / 0.4)"
    : isActive
      ? "hsl(var(--primary) / 0.3)"
      : "hsl(var(--border) / 0.3)";

  const strandOpacity = isCompleted ? 0.7 : isActive ? 1 : 0.5;
  const glowIntensity = isActive ? 3 : 0;

  return (
    <div className={cn("w-[40px] flex items-center justify-center", className)}>
      <svg
        xmlns={SVG_NS}
        width={HELIX_WIDTH}
        height={HELIX_HEIGHT}
        viewBox={`0 0 ${HELIX_WIDTH} ${HELIX_HEIGHT}`}
        fill="none"
        className="overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <filter id={`dna-glow-${delay}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur
              stdDeviation={glowIntensity}
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient
            id={`dna-grad-a-${delay}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={strandColor} stopOpacity={strandOpacity}>
              {isActive && !shouldReduceMotion && (
                <animate
                  attributeName="stop-opacity"
                  values={`${strandOpacity};${strandOpacity * 0.6};${strandOpacity}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="100%" stopColor={strandColor} stopOpacity={strandOpacity * 0.6}>
              {isActive && !shouldReduceMotion && (
                <animate
                  attributeName="stop-opacity"
                  values={`${strandOpacity * 0.6};${strandOpacity};${strandOpacity * 0.6}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>

          <linearGradient
            id={`dna-grad-b-${delay}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={strandColor} stopOpacity={strandOpacity * 0.6} />
            <stop offset="100%" stopColor={strandColor} stopOpacity={strandOpacity}>
              {isActive && !shouldReduceMotion && (
                <animate
                  attributeName="stop-opacity"
                  values={`${strandOpacity};${strandOpacity * 0.6};${strandOpacity}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>
        </defs>

        {/* Rungs (cross-links) */}
        {RUNG_POSITIONS.map((rung, i) => (
          <motion.line
            key={`rung-${i}`}
            x1={rung.x1}
            y1={rung.y}
            x2={rung.x2}
            y2={rung.y}
            stroke={rungColor}
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.1 + i * 0.05 }}
          />
        ))}

        {/* Strand A (front) */}
        <motion.path
          d={STRAND_A_PATH}
          stroke={`url(#dna-grad-a-${delay})`}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          filter={isActive ? `url(#dna-glow-${delay})` : undefined}
          initial={shouldReduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
        />

        {/* Strand B (back) - drawn with segments for depth effect */}
        <motion.path
          d={STRAND_B_PATH}
          stroke={`url(#dna-grad-b-${delay})`}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
          initial={shouldReduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 0.6, delay: delay + 0.15, ease: "easeOut" }}
        />

        {/* Traveling particles */}
        {isActive && !shouldReduceMotion && particleConfig.map((p, i) => (
          <HelixParticle key={`particle-${i}`} path={p.path} delay={p.delay} />
        ))}
      </svg>
    </div>
  );
});
