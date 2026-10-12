"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  LEFT_T,
  PLANE,
  T0,
  T_MAX,
  VIEW_H,
  VIEW_W,
  buildViewPath,
  evalWave,
  lengthAt,
  project,
  sampleWave,
  type ViewPath,
} from "./wave-math";

const INK = "#18181b";
const ROSE = "#b95f65";
const ROSE_LIGHT = "#df8f93";
const VIOLET = "#7d6fae";
const VIOLET_TINT = "#c7bde4";
const ROSE_TINT = "#e3c4c8";
const NEUTRAL_TINT = "#d8d4de";
const SERIF = "ivypresto-headline, 'Times New Roman', Georgia, serif";
const PAD = 0.06; // planes extend slightly past the t domain

function quad(corners: Array<[number, number, number]>): string {
  return (
    corners
      .map(([t, re, im], i) => {
        const [x, y] = project(t, re, im);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join("") + "Z"
  );
}

const BACK_PLANE = quad([
  [-PAD, PLANE, -PLANE],
  [T_MAX + PAD, PLANE, -PLANE],
  [T_MAX + PAD, PLANE, PLANE],
  [-PAD, PLANE, PLANE],
]);
const BOTTOM_PLANE = quad([
  [-PAD, -PLANE, -PLANE],
  [T_MAX + PAD, -PLANE, -PLANE],
  [T_MAX + PAD, PLANE, -PLANE],
  [-PAD, PLANE, -PLANE],
]);
const LEFT_PLANE = quad([
  [LEFT_T, -PLANE, -PLANE],
  [LEFT_T, PLANE, -PLANE],
  [LEFT_T, PLANE, PLANE],
  [LEFT_T, -PLANE, PLANE],
]);

// Angle of the t axis on screen, used to lay formula labels along the planes.
const T_ANGLE = (Math.atan2(28, 150) * 180) / Math.PI;

const fmtSigned = (x: number) => `${x < 0 ? "−" : "+"}${Math.abs(x).toFixed(2)}`;
const fmtComplex = (re: number, im: number) =>
  `${fmtSigned(re)} ${im < 0 ? "−" : "+"} ${Math.abs(im).toFixed(2)}i`;

export interface ComplexWaveProps {
  /** Angular frequency ω in radians per t-unit. */
  initialOmega?: number;
  /** Gaussian decay rate γ. */
  initialGamma?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  /** Playback speed in t-units per second (domain is 2.44 t-units). */
  speed?: number;
  className?: string;
}

export function ComplexWave({
  initialOmega = 18,
  initialGamma = 3.5,
  autoPlay = true,
  showControls = true,
  speed = 0.35,
  className,
}: ComplexWaveProps) {
  const [playing, setPlaying] = useState(autoPlay);
  const [omega, setOmega] = useState(initialOmega);
  const [gamma, setGamma] = useState(initialGamma);

  const tRef = useRef(0);
  const draggingRef = useRef(false);
  const wasPlayingRef = useRef(false);

  const spiralTraceRef = useRef<SVGPathElement>(null);
  const leftTraceRef = useRef<SVGPathElement>(null);
  const backTraceRef = useRef<SVGPathElement>(null);
  const bottomTraceRef = useRef<SVGPathElement>(null);
  const tipArrowRef = useRef<SVGLineElement>(null);
  const leftArrowRef = useRef<SVGLineElement>(null);
  const backArrowRef = useRef<SVGLineElement>(null);
  const bottomArrowRef = useRef<SVGLineElement>(null);
  const dashLeftRef = useRef<SVGLineElement>(null);
  const dashBackRef = useRef<SVGLineElement>(null);
  const dashBottomRef = useRef<SVGLineElement>(null);
  const tipDotRef = useRef<SVGCircleElement>(null);
  const fSpanRef = useRef<HTMLSpanElement>(null);
  const tSpanRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const views = useMemo(() => {
    const samples = sampleWave(omega, gamma);
    return {
      spiral: buildViewPath(samples.map((s) => project(s.t, s.re, s.im))),
      left: buildViewPath(samples.map((s) => project(LEFT_T, s.re, s.im))),
      back: buildViewPath(samples.map((s) => project(s.t, PLANE, s.im))),
      bottom: buildViewPath(samples.map((s) => project(s.t, s.re, -PLANE))),
    };
  }, [omega, gamma]);

  const applyFrame = useCallback(
    (t: number) => {
      const u = t / T_MAX;
      const { re, im } = evalWave(t, omega, gamma);

      const setTrace = (el: SVGPathElement | null, vp: ViewPath) => {
        if (el) el.style.strokeDashoffset = `${vp.total - lengthAt(vp, u)}`;
      };
      setTrace(spiralTraceRef.current, views.spiral);
      setTrace(leftTraceRef.current, views.left);
      setTrace(backTraceRef.current, views.back);
      setTrace(bottomTraceRef.current, views.bottom);

      const tip = project(t, re, im);
      const leftPt = project(LEFT_T, re, im);
      const backPt = project(t, PLANE, im);
      const bottomPt = project(t, re, -PLANE);

      const setLine = (
        el: SVGLineElement | null,
        a: readonly [number, number],
        b: readonly [number, number],
      ) => {
        if (!el) return;
        el.setAttribute("x1", a[0].toFixed(1));
        el.setAttribute("y1", a[1].toFixed(1));
        el.setAttribute("x2", b[0].toFixed(1));
        el.setAttribute("y2", b[1].toFixed(1));
      };
      setLine(tipArrowRef.current, project(t, 0, 0), tip);
      setLine(leftArrowRef.current, project(LEFT_T, 0, 0), leftPt);
      setLine(backArrowRef.current, project(t, PLANE, 0), backPt);
      setLine(bottomArrowRef.current, project(t, 0, -PLANE), bottomPt);
      setLine(dashLeftRef.current, tip, leftPt);
      setLine(dashBackRef.current, tip, backPt);
      setLine(dashBottomRef.current, tip, bottomPt);

      if (tipDotRef.current) {
        tipDotRef.current.setAttribute("cx", tip[0].toFixed(1));
        tipDotRef.current.setAttribute("cy", tip[1].toFixed(1));
      }
      if (fSpanRef.current) fSpanRef.current.textContent = fmtComplex(re, im);
      if (tSpanRef.current)
        tSpanRef.current.textContent = ((t * omega) / (2 * Math.PI)).toFixed(2);
      if (dotRef.current) dotRef.current.style.left = `${(u * 100).toFixed(2)}%`;
    },
    [omega, gamma, views],
  );

  // Resync everything imperative the same paint a rebuilt path lands.
  useLayoutEffect(() => {
    applyFrame(tRef.current);
  }, [applyFrame]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      tRef.current = (tRef.current + dt * speed) % T_MAX;
      applyFrame(tRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, applyFrame]);

  const scrubTo = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const u = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 0.9999);
    tRef.current = u * T_MAX;
    applyFrame(tRef.current);
  };

  // Deterministic t = 0 frame so SSR markup shows a sensible initial state.
  const f0 = evalWave(0, omega, gamma);
  const tip0 = project(0, f0.re, f0.im);
  const imLabelPos = project(0.35, PLANE, 1.32);
  const reLabelPos = project(-0.35, -1.35, -PLANE);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        role="img"
        aria-label="Complex Gaussian wave packet: a spiral along the time axis with its real, imaginary, and complex-plane projections"
      >
        <defs>
          {(
            [
              ["cw-arrow", INK],
              ["cw-arrow-rose", ROSE],
              ["cw-arrow-violet", VIOLET],
            ] as const
          ).map(([id, color]) => (
            <marker
              key={id}
              id={id}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="9"
              markerHeight="9"
              markerUnits="userSpaceOnUse"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 Z" fill={color} />
            </marker>
          ))}
        </defs>

        {/* projection planes, tinted toward their curve's color */}
        <path d={BACK_PLANE} fill={VIOLET_TINT} fillOpacity={0.32} stroke={INK} strokeOpacity={0.1} />
        <path d={BOTTOM_PLANE} fill={ROSE_TINT} fillOpacity={0.38} stroke={INK} strokeOpacity={0.1} />
        <path d={LEFT_PLANE} fill={NEUTRAL_TINT} fillOpacity={0.35} stroke={INK} strokeOpacity={0.1} />

        {/* panel center lines */}
        <path d={buildViewPath([project(-PAD, PLANE, 0), project(T_MAX + PAD, PLANE, 0)]).d} stroke={INK} strokeOpacity={0.25} strokeWidth={0.8} />
        <path d={buildViewPath([project(-PAD, 0, -PLANE), project(T_MAX + PAD, 0, -PLANE)]).d} stroke={INK} strokeOpacity={0.25} strokeWidth={0.8} />
        <path d={buildViewPath([project(LEFT_T, -PLANE, 0), project(LEFT_T, PLANE, 0)]).d} stroke={INK} strokeOpacity={0.25} strokeWidth={0.8} />
        <path d={buildViewPath([project(LEFT_T, 0, -PLANE), project(LEFT_T, 0, PLANE)]).d} stroke={INK} strokeOpacity={0.25} strokeWidth={0.8} />

        {/* main axes */}
        <path d={buildViewPath([project(-0.12, 0, 0), project(T_MAX + 0.3, 0, 0)]).d} stroke={INK} strokeWidth={1.4} markerEnd="url(#cw-arrow)" />
        <path d={buildViewPath([project(0, -1.35, 0), project(0, 1.45, 0)]).d} stroke={INK} strokeWidth={1.4} markerEnd="url(#cw-arrow)" />
        <path d={buildViewPath([project(0, 0, -1.35), project(0, 0, 1.42)]).d} stroke={INK} strokeWidth={1.4} markerEnd="url(#cw-arrow)" />

        {/* t₀ marker */}
        <path
          d={buildViewPath([project(T0, 0, 0), project(T0, 0, -PLANE)]).d}
          stroke={INK}
          strokeOpacity={0.4}
          strokeWidth={1}
          strokeDasharray="3 4"
        />

        {/* full (future) curves, faint, hue-coded per view */}
        <path d={views.left.d} fill="none" stroke={INK} strokeOpacity={0.16} strokeWidth={1.1} />
        <path d={views.back.d} fill="none" stroke={VIOLET} strokeOpacity={0.28} strokeWidth={1.1} />
        <path d={views.bottom.d} fill="none" stroke={ROSE} strokeOpacity={0.28} strokeWidth={1.1} />
        <path d={views.spiral.d} fill="none" stroke={INK} strokeOpacity={0.16} strokeWidth={1.3} />

        {/* traced (past) curves — revealed via dashoffset */}
        <path ref={leftTraceRef} d={views.left.d} fill="none" stroke={INK} strokeWidth={1.8} strokeDasharray={views.left.total} strokeDashoffset={views.left.total} />
        <path ref={backTraceRef} d={views.back.d} fill="none" stroke={VIOLET} strokeWidth={2} strokeDasharray={views.back.total} strokeDashoffset={views.back.total} />
        <path ref={bottomTraceRef} d={views.bottom.d} fill="none" stroke={ROSE} strokeWidth={2} strokeDasharray={views.bottom.total} strokeDashoffset={views.bottom.total} />
        <path ref={spiralTraceRef} d={views.spiral.d} fill="none" stroke={INK} strokeWidth={2.4} strokeDasharray={views.spiral.total} strokeDashoffset={views.spiral.total} strokeLinecap="round" />

        {/* dashed connectors from the moving point to each projection */}
        <line ref={dashLeftRef} x1={tip0[0]} y1={tip0[1]} x2={tip0[0]} y2={tip0[1]} stroke={INK} strokeOpacity={0.25} strokeWidth={1} strokeDasharray="3 4" />
        <line ref={dashBackRef} x1={tip0[0]} y1={tip0[1]} x2={tip0[0]} y2={tip0[1]} stroke={VIOLET} strokeOpacity={0.4} strokeWidth={1} strokeDasharray="3 4" />
        <line ref={dashBottomRef} x1={tip0[0]} y1={tip0[1]} x2={tip0[0]} y2={tip0[1]} stroke={ROSE} strokeOpacity={0.4} strokeWidth={1} strokeDasharray="3 4" />

        {/* moving arrows, colored to match their view */}
        <line ref={tipArrowRef} x1={project(0, 0, 0)[0]} y1={project(0, 0, 0)[1]} x2={tip0[0]} y2={tip0[1]} stroke={INK} strokeWidth={1.8} markerEnd="url(#cw-arrow)" />
        <line ref={leftArrowRef} x1={project(LEFT_T, 0, 0)[0]} y1={project(LEFT_T, 0, 0)[1]} x2={project(LEFT_T, f0.re, f0.im)[0]} y2={project(LEFT_T, f0.re, f0.im)[1]} stroke={INK} strokeWidth={1.8} markerEnd="url(#cw-arrow)" />
        <line ref={backArrowRef} x1={project(0, PLANE, 0)[0]} y1={project(0, PLANE, 0)[1]} x2={project(0, PLANE, f0.im)[0]} y2={project(0, PLANE, f0.im)[1]} stroke={VIOLET} strokeWidth={1.8} markerEnd="url(#cw-arrow-violet)" />
        <line ref={bottomArrowRef} x1={project(0, 0, -PLANE)[0]} y1={project(0, 0, -PLANE)[1]} x2={project(0, f0.re, -PLANE)[0]} y2={project(0, f0.re, -PLANE)[1]} stroke={ROSE} strokeWidth={1.8} markerEnd="url(#cw-arrow-rose)" />
        <circle ref={tipDotRef} cx={tip0[0]} cy={tip0[1]} r={3} fill={ROSE_LIGHT} stroke={ROSE} strokeWidth={1} />

        {/* labels */}
        <g fontFamily={SERIF} fontStyle="italic" fill={INK}>
          <text x={136} y={72} fontSize={17} textAnchor="end">Im</text>
          <text x={234} y={140} fontSize={17}>Re</text>
          <text x={572} y={284} fontSize={17}>t</text>
          <text x={project(T0, 0, 0)[0] - 6} y={project(T0, 0, 0)[1] + 20} fontSize={15}>t₀</text>
          <text
            x={imLabelPos[0]}
            y={imLabelPos[1]}
            fontSize={13}
            fill={VIOLET}
            transform={`rotate(${T_ANGLE.toFixed(1)} ${imLabelPos[0]} ${imLabelPos[1]})`}
          >
            Im f = e
            <tspan dy={-6} fontSize={9}>−γ(t−t₀)²</tspan>
            <tspan dy={6} fontSize={13}> sin(ωt)</tspan>
          </text>
          <text
            x={reLabelPos[0]}
            y={reLabelPos[1]}
            fontSize={13}
            fill={ROSE}
            transform={`rotate(${T_ANGLE.toFixed(1)} ${reLabelPos[0]} ${reLabelPos[1]})`}
          >
            Re f = e
            <tspan dy={-6} fontSize={9}>−γ(t−t₀)²</tspan>
            <tspan dy={6} fontSize={13}> cos(ωt)</tspan>
          </text>
        </g>
      </svg>

      {showControls && (
        <>
          <div className="mx-auto w-full max-w-md font-ivypresto italic text-zinc-950">
            <p className="text-center text-xl tabular-nums">
              f(t) = <span ref={fSpanRef}>{fmtComplex(f0.re, f0.im)}</span>
            </p>
            <div className="flex items-center gap-3">
              <div
                ref={trackRef}
                className="relative h-8 grow cursor-pointer touch-none select-none"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  draggingRef.current = true;
                  wasPlayingRef.current = playing;
                  setPlaying(false);
                  scrubTo(e.clientX);
                }}
                onPointerMove={(e) => {
                  if (draggingRef.current) scrubTo(e.clientX);
                }}
                onPointerUp={() => {
                  draggingRef.current = false;
                  if (wasPlayingRef.current) setPlaying(true);
                }}
                onPointerCancel={() => {
                  draggingRef.current = false;
                  if (wasPlayingRef.current) setPlaying(true);
                }}
              >
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-zinc-900/50" />
                <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-zinc-900" />
                <div className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-zinc-900" />
                <div
                  ref={dotRef}
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b95f65]"
                  style={{ left: "0%" }}
                />
              </div>
              <span className="text-lg">t</span>
            </div>
            <p className="text-sm tabular-nums">
              t = <span ref={tSpanRef}>0.00</span>
              <span className="not-italic"> </span>T
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-md items-center gap-5 text-zinc-950">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                  <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
                  <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden>
                  <path d="M4 2.5v11l9-5.5z" />
                </svg>
              )}
            </Button>
            <label className="flex grow items-center gap-3">
              <span className="w-4 font-ivypresto text-lg italic">ω</span>
              <Slider
                value={[omega]}
                min={6}
                max={40}
                step={0.5}
                onValueChange={([v]) => setOmega(v)}
                aria-label="Angular frequency omega"
                className="[&>span:first-child]:h-1 [&>span:first-child]:bg-zinc-900/10 [&>span:first-child>span]:bg-[#b95f65] [&>span:last-child]:h-3.5 [&>span:last-child]:w-3.5 [&>span:last-child]:border-zinc-900/50 [&>span:last-child]:bg-[#f4f1ea]"
              />
              <span className="w-9 text-right font-nuvo text-xs tabular-nums text-zinc-500">{omega.toFixed(1)}</span>
            </label>
            <label className="flex grow items-center gap-3">
              <span className="w-4 font-ivypresto text-lg italic">γ</span>
              <Slider
                value={[gamma]}
                min={0.5}
                max={10}
                step={0.1}
                onValueChange={([v]) => setGamma(v)}
                aria-label="Decay rate gamma"
                className="[&>span:first-child]:h-1 [&>span:first-child]:bg-zinc-900/10 [&>span:first-child>span]:bg-[#b95f65] [&>span:last-child]:h-3.5 [&>span:last-child]:w-3.5 [&>span:last-child]:border-zinc-900/50 [&>span:last-child]:bg-[#f4f1ea]"
              />
              <span className="w-9 text-right font-nuvo text-xs tabular-nums text-zinc-500">{gamma.toFixed(1)}</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
}
