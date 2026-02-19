import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const pathD = "M-20 -10 L-20 140 Q-20 200 40 200 L700 200 Q760 200 760 260 L760 500 Q760 560 820 560 L1380 560 Q1440 560 1440 620 L1440 920";

// Dense sample points for smooth water-like flow
const points = [
  { x: -20, y: -10 }, { x: -20, y: 30 }, { x: -20, y: 65 }, { x: -20, y: 100 }, { x: -20, y: 130 }, { x: -20, y: 145 },
  { x: -15, y: 160 }, { x: -5, y: 175 }, { x: 5, y: 188 }, { x: 18, y: 195 }, { x: 35, y: 199 }, { x: 55, y: 200 },
  { x: 100, y: 200 }, { x: 160, y: 200 }, { x: 230, y: 200 }, { x: 310, y: 200 }, { x: 400, y: 200 },
  { x: 490, y: 200 }, { x: 580, y: 200 }, { x: 660, y: 200 }, { x: 700, y: 200 },
  { x: 720, y: 203 }, { x: 735, y: 210 }, { x: 748, y: 222 }, { x: 755, y: 238 }, { x: 760, y: 258 },
  { x: 760, y: 300 }, { x: 760, y: 350 }, { x: 760, y: 400 }, { x: 760, y: 450 }, { x: 760, y: 500 },
  { x: 763, y: 520 }, { x: 770, y: 535 }, { x: 782, y: 548 }, { x: 798, y: 556 }, { x: 818, y: 560 },
  { x: 870, y: 560 }, { x: 940, y: 560 }, { x: 1020, y: 560 }, { x: 1100, y: 560 }, { x: 1190, y: 560 },
  { x: 1280, y: 560 }, { x: 1360, y: 560 }, { x: 1385, y: 562 },
  { x: 1405, y: 570 }, { x: 1420, y: 582 }, { x: 1432, y: 598 }, { x: 1438, y: 616 }, { x: 1440, y: 640 },
  { x: 1440, y: 690 }, { x: 1440, y: 740 }, { x: 1440, y: 790 }, { x: 1440, y: 840 }, { x: 1440, y: 890 }, { x: 1440, y: 920 },
];

const xValues = points.map(p => p.x);
const yValues = points.map(p => p.y);
const numPts = points.length;

// Aura colors: smooth gradient from red → amber → green across all points
const lerp = (a: string[], count: number) => {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const idx = Math.min(Math.floor(t * (a.length - 1)), a.length - 2);
    result.push(a[idx + (t * (a.length - 1) - idx > 0.5 ? 1 : 0)]);
  }
  return result;
};
const auraColors = lerp(['#dc2626', '#ea580c', '#f59e0b', '#eab308', '#a3e635', '#22c55e', '#00d084', '#00d084'], numPts);

const GlobeOnPath = () => {
  const duration = 20;
  const repeat = Infinity;
  const repeatDelay = 1.5;
  const ease = "linear" as const;
  const svgDur = `${duration}s`;

  return (
    <g>
      {/* Outer soft aura — large blur */}
      <motion.circle
        r="36"
        fill="none"
        initial={{ cx: xValues[0], cy: yValues[0], opacity: 0 }}
        animate={{ cx: xValues, cy: yValues, opacity: [0, 0.18, 0.18, 0.18, 0.12, 0] }}
        transition={{ duration, ease, repeat, repeatDelay }}
        style={{ filter: 'blur(28px)' }}
      >
        <animate attributeName="fill" values={auraColors.join(';')} dur={svgDur} repeatCount="indefinite" />
      </motion.circle>

      {/* Mid aura glow */}
      <motion.circle
        r="24"
        initial={{ cx: xValues[0], cy: yValues[0], opacity: 0 }}
        animate={{ cx: xValues, cy: yValues, opacity: [0, 0.3, 0.3, 0.3, 0.2, 0] }}
        transition={{ duration, ease, repeat, repeatDelay }}
        style={{ filter: 'blur(12px)' }}
      >
        <animate attributeName="fill" values={auraColors.join(';')} dur={svgDur} repeatCount="indefinite" />
      </motion.circle>

      {/* Soft halo ring */}
      <motion.circle
        r="20"
        fill="none"
        strokeWidth="1.5"
        initial={{ cx: xValues[0], cy: yValues[0], opacity: 0 }}
        animate={{ cx: xValues, cy: yValues, opacity: [0, 0.3, 0.25, 0.2, 0.15, 0] }}
        transition={{ duration, ease, repeat, repeatDelay }}
        style={{ filter: 'blur(3px)' }}
      >
        <animate attributeName="stroke" values={auraColors.join(';')} dur={svgDur} repeatCount="indefinite" />
      </motion.circle>

      {/* Globe body */}
      <motion.circle
        r="14"
        initial={{ cx: xValues[0], cy: yValues[0], opacity: 0 }}
        animate={{ cx: xValues, cy: yValues, opacity: [0, 1, 1, 1, 1, 0] }}
        transition={{ duration, ease, repeat, repeatDelay }}
        fill="url(#globeBody)"
      />

      {/* Inner ember glow */}
      <motion.circle
        r="7"
        initial={{ cx: xValues[0], cy: yValues[0], opacity: 0 }}
        animate={{ cx: xValues, cy: yValues, opacity: [0, 0.3, 0.25, 0.2, 0.1, 0] }}
        transition={{ duration, ease, repeat, repeatDelay }}
        fill="url(#emberGlow)"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Gloss highlight */}
      <motion.ellipse
        rx="6"
        ry="4"
        initial={{ cx: xValues[0] - 4, cy: yValues[0] - 5, opacity: 0 }}
        animate={{
          cx: xValues.map(x => x - 4),
          cy: yValues.map(y => y - 5),
          opacity: [0, 0.3, 0.3, 0.3, 0.3, 0],
        }}
        transition={{ duration, ease, repeat, repeatDelay }}
        fill="url(#glossHighlight)"
      />
    </g>
  );
};

export const NetZeroPath = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [pathComplete, setPathComplete] = useState(false);

  return (
    <>
      {/* Desktop animation */}
      <svg
        ref={ref}
        className="absolute inset-0 w-full h-full hidden md:block"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Multi-layer path glow filter */}
          <filter id="pathGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="16" result="blur2" />
            <feGaussianBlur stdDeviation="30" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Globe body gradient — deep matte black with subtle edge */}
          <radialGradient id="globeBody" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="60%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>

          {/* Inner ember glow */}
          <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#f97316" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>

          {/* Gloss highlight */}
          <radialGradient id="glossHighlight" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Trail gradient */}
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0" />
            <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#22c55e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00d084" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Outermost glow layer */}
        <motion.path
          d={pathD}
          stroke="hsl(158, 80%, 45%)"
          strokeWidth="88"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.04"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 3.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          style={{ filter: 'blur(40px)' }}
        />

        {/* Mid glow layer */}
        <motion.path
          d={pathD}
          stroke="hsl(158, 80%, 45%)"
          strokeWidth="60"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.07"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 3.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          style={{ filter: 'blur(16px)' }}
        />

        {/* Main pathway line — 20px thick */}
        <motion.path
          d={pathD}
          stroke="hsl(158, 75%, 44%)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 3.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          filter="url(#pathGlow)"
          onAnimationComplete={() => setPathComplete(true)}
        />

        {/* Energy trail behind the globe */}
        {pathComplete && (
          <motion.path
            d={pathD}
            stroke="url(#trailGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.4, 0.25, 0] }}
            transition={{
              pathLength: { duration: 20, ease: "linear", repeat: Infinity, repeatDelay: 1.5 },
              opacity: { duration: 21.5, ease: "linear", repeat: Infinity, repeatDelay: 0 },
            }}
          />
        )}

        {/* The black globe */}
        {pathComplete && <GlobeOnPath />}

      </svg>

      {/* Mobile fallback */}
      <div className="absolute inset-0 md:hidden overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-1 h-full rounded-full"
          style={{
            background: 'linear-gradient(to bottom, hsl(158, 100%, 41%), transparent)',
            opacity: 0.3,
            marginLeft: '1.5rem',
          }}
        />
      </div>
    </>
  );
};
