"use client";

import type { MutableRefObject, ReactNode } from "react";
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
  buildViewPath,
  lengthAt,
} from "@/components/playground/complex-wave/wave-math";
import {
  dft,
  evalComplex,
  evalReal,
  evalRealConjugate,
  maxErrorPct,
  normalize,
  realSeries,
  resampleClosed,
  type Coef,
  type Pt,
  type RealSeries,
} from "./outline-math";

const INK = "#18181b";
const ROSE = "#b95f65";
const ROSE_LIGHT = "#df8f93";
const VIOLET = "#7d6fae";
const SERIF = "ivypresto-headline, 'Times New Roman', Georgia, serif";

const VIEW_W = 640;
const TWO_PI = 2 * Math.PI;
const MARGIN = 12;

export type OutlineMode = "complex" | "axes";

export interface SilhouettePath {
  d: string;
  fillRule?: "nonzero" | "evenodd";
}

export interface FourierOutlineProps {
  /** Closed outline as a polyline, y up. */
  points: readonly Pt[];
  /**
   * "complex": one chain, z(t) = Σ c_k e^{ikt}, the N biggest circles first.
   * "axes": one real chain per coordinate, N = highest harmonic kept.
   */
  mode?: OutlineMode;
  /** Upper bound of the N slider. */
  maxTerms?: number;
  initialTerms?: number;
  /** Step N up through 1, 2, 4, … each time the pen completes a loop. */
  autoGrow?: boolean;
  /** Explicit N values for auto-grow, replacing the doubling sequence. */
  growSteps?: number[];
  /** Fired when auto-grow finishes a loop at its last step, before wrapping. */
  onSequenceEnd?: () => void;
  /**
   * Optional SVG path data to draw as the target silhouette instead of the
   * sampled polygon. Must be in the coordinate system `points` were sampled
   * from, with y pointing down (points are expected as [x, −y]).
   */
  silhouettePaths?: SilhouettePath[];
  /** Small caption in the top-right corner. */
  label?: ReactNode;
  /** Radians of t per second. */
  speed?: number;
  /** Outline samples used for the transform. */
  samples?: number;
  color?: string;
  formula?: ReactNode;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

interface Seg {
  cx: number;
  cy: number;
  r: number;
  tx: number;
  ty: number;
}

function complexChain(
  t: number,
  circles: readonly Coef[],
  count: number,
  scale: number,
  ox: number,
  oy: number,
): { segs: Seg[]; tip: [number, number] } {
  const segs: Seg[] = [];
  let px = ox;
  let py = oy;
  for (let j = 0; j < count; j++) {
    const { k, amp, phase } = circles[j];
    const r = amp * scale;
    const ang = k * t + phase;
    const tx = px + r * Math.cos(ang);
    const ty = py - r * Math.sin(ang);
    segs.push({ cx: px, cy: py, r, tx, ty });
    px = tx;
    py = ty;
  }
  return { segs, tip: [px, py] };
}

// A real chain: circle k has radius amp_k and angle kt − phase_k (+rot). With
// rot = 0 the tip's horizontal offset is exactly Σ amp cos(kt − phase) = x(t) − mean;
// with rot = π/2 the tip's screen-vertical offset is −(y(t) − mean).
function realChain(
  t: number,
  series: RealSeries,
  count: number,
  scale: number,
  ox: number,
  oy: number,
  rot: number,
): { segs: Seg[]; tip: [number, number] } {
  const segs: Seg[] = [];
  let px = ox;
  let py = oy;
  const top = Math.min(count, series.terms.length);
  for (let j = 0; j < top; j++) {
    const { k, amp, phase } = series.terms[j];
    const r = amp * scale;
    const ang = k * t - phase + rot;
    const tx = px + r * Math.cos(ang);
    const ty = py - r * Math.sin(ang);
    segs.push({ cx: px, cy: py, r, tx, ty });
    px = tx;
    py = ty;
  }
  return { segs, tip: [px, py] };
}

function growSequence(max: number): number[] {
  const seq: number[] = [];
  for (let n = 1; n < max; n *= 2) seq.push(n);
  seq.push(max);
  return seq;
}

function fmtError(pct: number): string {
  if (pct >= 10) return pct.toFixed(1);
  if (pct >= 0.01) return pct.toFixed(2);
  return "<0.01";
}

// Initial render values are rounded so the server and browser agree bit-for-bit;
// trig results can differ in the last ulp between the two runtimes.
const f1 = (v: number) => Math.round(v * 10) / 10;

function setAttrs(el: Element | null, attrs: Record<string, number>) {
  if (!el) return;
  for (const key in attrs) el.setAttribute(key, attrs[key].toFixed(1));
}

export function FourierOutline({
  points,
  mode = "complex",
  maxTerms = mode === "complex" ? 128 : 64,
  initialTerms = 1,
  autoGrow = true,
  growSteps,
  onSequenceEnd,
  silhouettePaths,
  label,
  speed = 1.1,
  samples = 512,
  color = ROSE,
  formula,
  autoPlay = true,
  showControls = true,
  className,
}: FourierOutlineProps) {
  const axes = mode === "axes";
  const VIEW_H = axes ? 520 : 400;

  const [playing, setPlaying] = useState(autoPlay);
  const [count, setCount] = useState(Math.min(initialTerms, maxTerms));
  const [grow, setGrow] = useState(autoGrow);

  const tRef = useRef(0);
  const traceRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<Array<SVGCircleElement | null>>([]);
  const vectorRefs = useRef<Array<SVGLineElement | null>>([]);
  const circleRefsY = useRef<Array<SVGCircleElement | null>>([]);
  const vectorRefsY = useRef<Array<SVGLineElement | null>>([]);
  const guideXRef = useRef<SVGLineElement>(null);
  const guideYRef = useRef<SVGLineElement>(null);
  const tipXRef = useRef<SVGCircleElement>(null);
  const tipYRef = useRef<SVGCircleElement>(null);
  const penRef = useRef<SVGCircleElement>(null);
  const onSequenceEndRef = useRef(onSequenceEnd);
  useEffect(() => {
    onSequenceEndRef.current = onSequenceEnd;
  }, [onSequenceEnd]);
  const countRef = useRef(count);
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  // Everything that depends only on the shape: samples, transform, layout.
  const shape = useMemo(() => {
    const { pts, width, center, height } = normalize(resampleClosed(points, samples));
    const coefs = dft(pts);
    const c0 = coefs.find((c) => c.k === 0) ?? { re: 0, im: 0 };
    const circles = coefs.filter((c) => c.k !== 0);
    const sx = realSeries(pts, 0, maxTerms);
    const sy = realSeries(pts, 1, maxTerms);

    // Farthest the chain tips wander from their fixed centres at max N.
    let reachC = 0;
    let reachX = 0;
    let reachY = 0;
    for (let i = 0; i < samples; i++) {
      const t = (TWO_PI * i) / samples;
      const [zx, zy] = evalComplex(circles, Math.min(maxTerms, circles.length), t);
      reachC = Math.max(reachC, Math.hypot(zx, zy));
      reachX = Math.max(
        reachX,
        Math.hypot(evalReal(sx, maxTerms, t) - sx.mean, evalRealConjugate(sx, maxTerms, t)),
      );
      reachY = Math.max(
        reachY,
        Math.hypot(evalReal(sy, maxTerms, t) - sy.mean, evalRealConjugate(sy, maxTerms, t)),
      );
    }

    let scale: number;
    let SX: number;
    let SY: number;
    let topY = 0;
    let leftX = 0;
    if (axes) {
      SX = 430;
      SY = 345;
      topY = 128;
      leftX = 150;
      scale = Math.min(
        230 / Math.max(width, 1),
        (topY - MARGIN) / reachX,
        (leftX - MARGIN) / reachY,
      );
    } else {
      SX = VIEW_W / 2;
      SY = VIEW_H / 2;
      const fitX = (SX - MARGIN) / (Math.abs(c0.re) + reachC);
      const fitY = (SY - MARGIN) / (Math.abs(c0.im) + reachC);
      scale = Math.min(250 / Math.max(width, 1), fitX, fitY);
    }

    const outlineD =
      pts
        .map(([x, y], i) => `${i === 0 ? "M" : "L"}${(SX + scale * x).toFixed(1)} ${(SY - scale * y).toFixed(1)}`)
        .join("") + "Z";

    return {
      pts,
      circles,
      c0,
      sx,
      sy,
      scale,
      height,
      SX,
      SY,
      outlineD,
      // Maps raw (y-down) source coordinates onto the screen.
      silhouetteTransform: `translate(${SX} ${SY}) scale(${scale / height}) translate(${-center[0]} ${center[1]})`,
      // chain origins
      originC: [SX + scale * c0.re, SY - scale * c0.im] as [number, number],
      originX: [SX + scale * sx.mean, topY] as [number, number],
      originY: [leftX, SY - scale * sy.mean] as [number, number],
    };
  }, [points, samples, maxTerms, axes, VIEW_H]);

  // Reconstruction with the current N: the path the pen will trace, and its error.
  const model = useMemo(() => {
    const { pts, circles, c0, sx, sy, scale, SX, SY } = shape;
    const recon: Pt[] = new Array(samples);
    for (let i = 0; i < samples; i++) {
      const t = (TWO_PI * i) / samples;
      if (axes) {
        recon[i] = [evalReal(sx, count, t), evalReal(sy, count, t)];
      } else {
        const [x, y] = evalComplex(circles, count, t);
        recon[i] = [x + c0.re, y + c0.im];
      }
    }
    const screen = recon.map(([x, y]) => [SX + scale * x, SY - scale * y] as const);
    screen.push(screen[0]);
    return {
      trace: buildViewPath(screen),
      error: maxErrorPct(pts, recon),
    };
  }, [shape, count, axes, samples]);

  const chainsAt = useCallback(
    (t: number) => {
      if (axes) {
        const cx = realChain(t, shape.sx, count, shape.scale, shape.originX[0], shape.originX[1], 0);
        const cy = realChain(t, shape.sy, count, shape.scale, shape.originY[0], shape.originY[1], Math.PI / 2);
        const pen: [number, number] = [cx.tip[0], cy.tip[1]];
        return { x: cx, y: cy, pen };
      }
      const c = complexChain(t, shape.circles, count, shape.scale, shape.originC[0], shape.originC[1]);
      return { x: c, y: null, pen: c.tip };
    },
    [axes, shape, count],
  );

  const applyFrame = useCallback(
    (t: number) => {
      if (traceRef.current) {
        traceRef.current.style.strokeDashoffset = `${model.trace.total - lengthAt(model.trace, t / TWO_PI)}`;
      }
      const { x, y, pen } = chainsAt(t);
      for (let k = 0; k < x.segs.length; k++) {
        const s = x.segs[k];
        setAttrs(circleRefs.current[k], { cx: s.cx, cy: s.cy });
        setAttrs(vectorRefs.current[k], { x1: s.cx, y1: s.cy, x2: s.tx, y2: s.ty });
      }
      if (y) {
        for (let k = 0; k < y.segs.length; k++) {
          const s = y.segs[k];
          setAttrs(circleRefsY.current[k], { cx: s.cx, cy: s.cy });
          setAttrs(vectorRefsY.current[k], { x1: s.cx, y1: s.cy, x2: s.tx, y2: s.ty });
        }
        setAttrs(tipXRef.current, { cx: x.tip[0], cy: x.tip[1] });
        setAttrs(tipYRef.current, { cx: y.tip[0], cy: y.tip[1] });
        setAttrs(guideXRef.current, { x1: x.tip[0], y1: x.tip[1], x2: pen[0], y2: pen[1] });
        setAttrs(guideYRef.current, { x1: y.tip[0], y1: y.tip[1], x2: pen[0], y2: pen[1] });
      }
      setAttrs(penRef.current, { cx: pen[0], cy: pen[1] });
    },
    [model, chainsAt],
  );

  useLayoutEffect(() => {
    applyFrame(tRef.current);
  }, [applyFrame]);

  const sequence = useMemo(
    () => (growSteps && growSteps.length > 0 ? growSteps : growSequence(maxTerms)),
    [growSteps, maxTerms],
  );

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const next = tRef.current + dt * speed;
      if (next >= TWO_PI) {
        tRef.current = next - TWO_PI;
        if (grow) {
          // Decided outside the state updater: updaters may run twice in
          // StrictMode, and the callback must fire exactly once.
          const i = sequence.findIndex((n) => n > countRef.current);
          if (i === -1) {
            onSequenceEndRef.current?.();
            setCount(sequence[0]);
          } else {
            setCount(sequence[i]);
          }
        }
      } else {
        tRef.current = next;
      }
      applyFrame(tRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, grow, sequence, applyFrame]);

  const init = chainsAt(tRef.current);

  const renderChain = (
    segs: Seg[],
    circles: MutableRefObject<Array<SVGCircleElement | null>>,
    vectors: MutableRefObject<Array<SVGLineElement | null>>,
    lead: string,
  ) =>
    segs.map((s, k) => (
      <g key={k}>
        <circle
          ref={(el) => {
            circles.current[k] = el;
          }}
          cx={f1(s.cx)}
          cy={f1(s.cy)}
          r={f1(s.r)}
          fill="none"
          stroke={k === 0 ? lead : INK}
          strokeOpacity={k === 0 ? 0.6 : 0.28}
          strokeWidth={k === 0 ? 1.3 : 0.9}
        />
        <line
          ref={(el) => {
            vectors.current[k] = el;
          }}
          x1={f1(s.cx)}
          y1={f1(s.cy)}
          x2={f1(s.tx)}
          y2={f1(s.ty)}
          stroke={INK}
          strokeOpacity={0.55}
          strokeWidth={1}
        />
      </g>
    ));

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        role="img"
        aria-label={
          axes
            ? "A closed outline drawn by two chains of rotating circles, one per coordinate, whose tips guide a pen"
            : "A closed outline drawn by a chain of rotating circles, each one term of its Fourier series"
        }
      >
        {/* target silhouette */}
        {silhouettePaths ? (
          <g transform={shape.silhouetteTransform} fill={INK} fillOpacity={0.08} stroke={INK} strokeOpacity={0.18} strokeWidth={1 / (shape.scale / shape.height)}>
            {silhouettePaths.map((p, i) => (
              <path key={i} d={p.d} fillRule={p.fillRule ?? "nonzero"} />
            ))}
          </g>
        ) : (
          <path d={shape.outlineD} fill={INK} fillOpacity={0.08} stroke={INK} strokeOpacity={0.18} strokeWidth={1} />
        )}

        {/* reconstruction so far — revealed via dashoffset */}
        <path
          ref={traceRef}
          d={model.trace.d}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray={model.trace.total}
          strokeDashoffset={model.trace.total}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {renderChain(init.x.segs, circleRefs, vectorRefs, axes ? VIOLET : color)}
        {init.y && renderChain(init.y.segs, circleRefsY, vectorRefsY, color)}

        {init.y && (
          <>
            <line ref={guideXRef} x1={f1(init.x.tip[0])} y1={f1(init.x.tip[1])} x2={f1(init.pen[0])} y2={f1(init.pen[1])} stroke={VIOLET} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="4 5" />
            <line ref={guideYRef} x1={f1(init.y.tip[0])} y1={f1(init.y.tip[1])} x2={f1(init.pen[0])} y2={f1(init.pen[1])} stroke={color} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="4 5" />
            <circle ref={tipXRef} cx={f1(init.x.tip[0])} cy={f1(init.x.tip[1])} r={2.5} fill={VIOLET} />
            <circle ref={tipYRef} cx={f1(init.y.tip[0])} cy={f1(init.y.tip[1])} r={2.5} fill={color} />
          </>
        )}

        <circle ref={penRef} cx={f1(init.pen[0])} cy={f1(init.pen[1])} r={3.2} fill={ROSE_LIGHT} stroke={color} strokeWidth={1} />

        {/* readout */}
        <text x={24} y={46} fontFamily={SERIF} fontSize={26} fill={INK}>
          <tspan fontStyle="italic">N</tspan>
          <tspan> = </tspan>
          <tspan fill={color}>{count}</tspan>
        </text>
        <text x={24} y={74} fontFamily={SERIF} fontSize={17} fill={INK} fillOpacity={0.75}>
          error = {fmtError(model.error)}%
        </text>
        {label && (
          <text x={VIEW_W - 24} y={40} fontFamily={SERIF} fontSize={15} fontStyle="italic" fill={INK} fillOpacity={0.6} textAnchor="end">
            {label}
          </text>
        )}
      </svg>

      {showControls && (
        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          {formula && (
            <p className="text-center font-ivypresto text-xl italic text-zinc-950">{formula}</p>
          )}
          <div className="flex items-center gap-5 text-zinc-950">
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
              <span className="w-14 font-ivypresto text-lg italic">circles</span>
              <Slider
                value={[count]}
                min={1}
                max={maxTerms}
                step={1}
                onValueChange={([v]) => {
                  setGrow(false);
                  setCount(v);
                }}
                aria-label="Number of circles"
                className="[&>span:first-child]:h-1 [&>span:first-child]:bg-zinc-900/10 [&>span:first-child>span]:bg-[#b95f65] [&>span:last-child]:h-3.5 [&>span:last-child]:w-3.5 [&>span:last-child]:border-zinc-900/50 [&>span:last-child]:bg-[#f4f1ea]"
              />
              <span className="w-9 text-right font-nuvo text-xs tabular-nums text-zinc-500">{count}</span>
            </label>
            <button
              type="button"
              onClick={() => setGrow((g) => !g)}
              aria-pressed={grow}
              className={cn(
                "shrink-0 font-nuvo text-[10px] uppercase tracking-widest transition-colors",
                grow ? "text-[#b95f65]" : "text-zinc-400 hover:text-zinc-700",
              )}
            >
              auto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
