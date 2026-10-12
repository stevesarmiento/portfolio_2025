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
  type ViewPath,
} from "@/components/playground/complex-wave/wave-math";
import {
  dft,
  evalComplex,
  evalReal,
  evalRealConjugate,
  maxErrorPct,
  normalizeMany,
  polyLength,
  realSeries,
  resampleClosed,
  scheduleContours,
  type Coef,
  type Pt,
  type RealSeries,
  type Slice,
} from "./outline-math";

const INK = "#18181b";
const ROSE = "#b95f65";
const ROSE_LIGHT = "#df8f93";
const VIOLET = "#7d6fae";
const SERIF = "ivypresto-headline, 'Times New Roman', Georgia, serif";

const VIEW_W = 640;
const TWO_PI = 2 * Math.PI;
const MARGIN = 12;
const MIN_CONTOUR_SAMPLES = 32;

export type OutlineMode = "complex" | "axes";

export interface SilhouettePath {
  d: string;
  fillRule?: "nonzero" | "evenodd";
}

export interface FourierOutlineProps {
  /**
   * Closed outline as a polyline (y up), or several of them. Each contour gets
   * its own Fourier series and is drawn in turn, pen lifted in between.
   */
  points: readonly Pt[] | readonly (readonly Pt[])[];
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
  /** Outline samples used for the transform, shared across contours. */
  samples?: number;
  /** Share of the loop spent on each pen-up hop between contours. */
  hopFraction?: number;
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

interface Chain {
  segs: Seg[];
  tip: [number, number];
}

interface ContourModel {
  pts: Pt[];
  circles: Coef[];
  c0: { re: number; im: number };
  sx: RealSeries;
  sy: RealSeries;
  originC: [number, number];
  originX: [number, number];
  originY: [number, number];
}

function toContours(points: FourierOutlineProps["points"]): Pt[][] {
  if (points.length === 0) return [];
  const first = points[0];
  if (typeof first[0] === "number") {
    return [[...(points as readonly Pt[])]];
  }
  return (points as readonly (readonly Pt[])[]).map((c) => [...c]).filter((c) => c.length >= 3);
}

function complexChain(
  t: number,
  circles: readonly Coef[],
  count: number,
  scale: number,
  ox: number,
  oy: number,
): Chain {
  const segs: Seg[] = [];
  let px = ox;
  let py = oy;
  const top = Math.min(count, circles.length);
  for (let j = 0; j < top; j++) {
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
): Chain {
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

function setVisible(el: Element | null, visible: boolean) {
  if (!el) return;
  el.setAttribute("visibility", visible ? "visible" : "hidden");
}

function findSlice(slices: readonly Slice[], t: number): number {
  for (let i = 0; i < slices.length; i++) {
    if (t < slices[i].hopEnd) return i;
  }
  return slices.length - 1;
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
  hopFraction = 0.05,
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
  const traceRefs = useRef<Array<SVGPathElement | null>>([]);
  const chainGroupRef = useRef<SVGGElement>(null);
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

  // Everything that depends only on the shape: samples, transforms, layout, schedule.
  const shape = useMemo(() => {
    const input = toContours(points);
    const safeInput: Pt[][] = input.length > 0 ? input : [[[0, 0], [1, 0], [1, 1]]];
    const inputLengths = safeInput.map(polyLength);
    const inputTotal = inputLengths.reduce((a, b) => a + b, 0) || 1;
    const resampled = safeInput.map((c, i) =>
      resampleClosed(c, Math.max(MIN_CONTOUR_SAMPLES, Math.round((samples * inputLengths[i]) / inputTotal))),
    );
    const norm = normalizeMany(resampled);
    const { width, center, height } = norm;

    // Per-contour transforms, plus how far each chain tip wanders at max N.
    const analysed = norm.contours.map((pts) => {
      const coefs = dft(pts);
      const c0 = coefs.find((c) => c.k === 0) ?? { re: 0, im: 0 };
      const circles = coefs.filter((c) => c.k !== 0);
      const sx = realSeries(pts, 0, maxTerms);
      const sy = realSeries(pts, 1, maxTerms);
      let reachC = 0;
      let reachX = 0;
      let reachY = 0;
      const n = pts.length;
      const topC = Math.min(maxTerms, circles.length);
      for (let i = 0; i < n; i++) {
        const t = (TWO_PI * i) / n;
        const [zx, zy] = evalComplex(circles, topC, t);
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
      return { pts, coefs, c0, circles, sx, sy, reachC, reachX, reachY };
    });

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
      const reachX = Math.max(...analysed.map((a) => a.reachX), 1e-6);
      const reachY = Math.max(...analysed.map((a) => a.reachY), 1e-6);
      scale = Math.min(230 / Math.max(width, 1), (topY - MARGIN) / reachX, (leftX - MARGIN) / reachY);
    } else {
      SX = VIEW_W / 2;
      SY = VIEW_H / 2;
      const fitX = Math.min(...analysed.map((a) => (SX - MARGIN) / (Math.abs(a.c0.re) + a.reachC)));
      const fitY = Math.min(...analysed.map((a) => (SY - MARGIN) / (Math.abs(a.c0.im) + a.reachC)));
      scale = Math.min(250 / Math.max(width, 1), fitX, fitY);
    }

    const contours: ContourModel[] = analysed.map((a) => ({
      pts: a.pts,
      circles: a.circles,
      c0: a.c0,
      sx: a.sx,
      sy: a.sy,
      originC: [SX + scale * a.c0.re, SY - scale * a.c0.im],
      originX: [SX + scale * a.sx.mean, topY],
      originY: [leftX, SY - scale * a.sy.mean],
    }));

    const outlineD = norm.contours
      .map(
        (pts) =>
          pts
            .map(([x, y], i) => `${i === 0 ? "M" : "L"}${(SX + scale * x).toFixed(1)} ${(SY - scale * y).toFixed(1)}`)
            .join("") + "Z",
      )
      .join("");

    const slices = scheduleContours(norm.contours.map(polyLength), hopFraction);

    // DOM element budget: enough circles for the richest contour.
    const maxCircles = Math.max(...contours.map((c) => Math.min(maxTerms, c.circles.length)), 1);
    const maxCirclesY = Math.max(...contours.map((c) => Math.min(maxTerms, c.sx.terms.length, c.sy.terms.length)), 1);

    return {
      contours,
      slices,
      scale,
      height,
      SX,
      SY,
      outlineD,
      maxCircles: axes ? maxCirclesY : maxCircles,
      // Maps raw (y-down) source coordinates onto the screen.
      silhouetteTransform: `translate(${SX} ${SY}) scale(${scale / height}) translate(${-center[0]} ${center[1]})`,
    };
  }, [points, samples, maxTerms, axes, VIEW_H, hopFraction]);

  // Reconstruction with the current N: one trace per contour, and the overall error.
  const model = useMemo(() => {
    const { contours, scale, SX, SY } = shape;
    const traces: ViewPath[] = [];
    const starts: Array<[number, number]> = [];
    let error = 0;
    for (const c of contours) {
      const n = c.pts.length;
      const recon: Pt[] = new Array(n);
      for (let i = 0; i < n; i++) {
        const t = (TWO_PI * i) / n;
        if (axes) {
          recon[i] = [evalReal(c.sx, count, t), evalReal(c.sy, count, t)];
        } else {
          const [x, y] = evalComplex(c.circles, count, t);
          recon[i] = [x + c.c0.re, y + c.c0.im];
        }
      }
      const screen = recon.map(([x, y]) => [SX + scale * x, SY - scale * y] as const);
      screen.push(screen[0]);
      traces.push(buildViewPath(screen));
      starts.push([screen[0][0], screen[0][1]]);
      error = Math.max(error, maxErrorPct(c.pts, recon));
    }
    return { traces, starts, error };
  }, [shape, count, axes]);

  const chainsFor = useCallback(
    (c: ContourModel, tau: number): { x: Chain; y: Chain | null; pen: [number, number] } => {
      if (axes) {
        const cx = realChain(tau, c.sx, count, shape.scale, c.originX[0], c.originX[1], 0);
        const cy = realChain(tau, c.sy, count, shape.scale, c.originY[0], c.originY[1], Math.PI / 2);
        return { x: cx, y: cy, pen: [cx.tip[0], cy.tip[1]] };
      }
      const ch = complexChain(tau, c.circles, count, shape.scale, c.originC[0], c.originC[1]);
      return { x: ch, y: null, pen: ch.tip };
    },
    [axes, count, shape.scale],
  );

  // State of the drawing at loop time t: active contour, chains, pen, hop fade.
  const stateAt = useCallback(
    (t: number) => {
      const { contours, slices } = shape;
      const idx = findSlice(slices, t);
      const s = slices[idx];
      if (t < s.end || s.hopEnd <= s.end) {
        const tau = ((t - s.start) / (s.end - s.start)) * TWO_PI;
        return { idx, tau, hop: false, opacity: 1, ...chainsFor(contours[idx], tau) };
      }
      // Pen up: glide straight to the next contour's start. Chain fades out at
      // the finished contour, then fades in already positioned on the next one.
      const u = (t - s.end) / (s.hopEnd - s.end);
      const nextIdx = (idx + 1) % contours.length;
      const from = model.starts[idx];
      const to = model.starts[nextIdx];
      const pen: [number, number] = [from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u];
      const chains = u < 0.5 ? chainsFor(contours[idx], TWO_PI) : chainsFor(contours[nextIdx], 0);
      const opacity = u < 0.5 ? 1 - u * 2 : (u - 0.5) * 2;
      return { idx, tau: TWO_PI, hop: true, opacity, x: chains.x, y: chains.y, pen };
    },
    [shape, model.starts, chainsFor],
  );

  const applyChain = (
    chain: Chain,
    circles: MutableRefObject<Array<SVGCircleElement | null>>,
    vectors: MutableRefObject<Array<SVGLineElement | null>>,
  ) => {
    const n = shape.maxCircles;
    for (let k = 0; k < n; k++) {
      const c = circles.current[k];
      const v = vectors.current[k];
      const seg = chain.segs[k];
      if (seg) {
        setAttrs(c, { cx: seg.cx, cy: seg.cy, r: seg.r });
        setAttrs(v, { x1: seg.cx, y1: seg.cy, x2: seg.tx, y2: seg.ty });
      }
      setVisible(c, !!seg);
      setVisible(v, !!seg);
    }
  };

  const applyFrame = useCallback(
    (t: number) => {
      const st = stateAt(t);
      // Traces: finished contours fully shown, the active one revealed by arc
      // length, later ones hidden.
      for (let j = 0; j < model.traces.length; j++) {
        const el = traceRefs.current[j];
        if (!el) continue;
        const tr = model.traces[j];
        let offset: number;
        if (j < st.idx || (j === st.idx && st.hop)) offset = 0;
        else if (j === st.idx) offset = tr.total - lengthAt(tr, st.tau / TWO_PI);
        else offset = tr.total;
        el.style.strokeDashoffset = `${offset}`;
      }
      if (chainGroupRef.current) {
        chainGroupRef.current.style.opacity = `${st.opacity}`;
      }
      applyChain(st.x, circleRefs, vectorRefs);
      if (st.y) {
        applyChain(st.y, circleRefsY, vectorRefsY);
        setAttrs(tipXRef.current, { cx: st.x.tip[0], cy: st.x.tip[1] });
        setAttrs(tipYRef.current, { cx: st.y.tip[0], cy: st.y.tip[1] });
        setAttrs(guideXRef.current, { x1: st.x.tip[0], y1: st.x.tip[1], x2: st.pen[0], y2: st.pen[1] });
        setAttrs(guideYRef.current, { x1: st.y.tip[0], y1: st.y.tip[1], x2: st.pen[0], y2: st.pen[1] });
      }
      setAttrs(penRef.current, { cx: st.pen[0], cy: st.pen[1] });
    },
    // applyChain only reads refs and shape.maxCircles, which is covered by stateAt's deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stateAt, model.traces],
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

  const init = stateAt(tRef.current);

  const renderChain = (
    chain: Chain,
    circles: MutableRefObject<Array<SVGCircleElement | null>>,
    vectors: MutableRefObject<Array<SVGLineElement | null>>,
    lead: string,
  ) =>
    Array.from({ length: shape.maxCircles }, (_, k) => {
      const s = chain.segs[k] ?? { cx: 0, cy: 0, r: 0, tx: 0, ty: 0 };
      const visible = k < chain.segs.length;
      return (
        <g key={k}>
          <circle
            ref={(el) => {
              circles.current[k] = el;
            }}
            cx={f1(s.cx)}
            cy={f1(s.cy)}
            r={f1(s.r)}
            visibility={visible ? "visible" : "hidden"}
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
            visibility={visible ? "visible" : "hidden"}
            stroke={INK}
            strokeOpacity={0.55}
            strokeWidth={1}
          />
        </g>
      );
    });

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
          <path d={shape.outlineD} fill={INK} fillOpacity={0.08} stroke={INK} strokeOpacity={0.18} strokeWidth={1} fillRule="evenodd" />
        )}

        {/* reconstruction so far — one path per contour, revealed via dashoffset */}
        {model.traces.map((tr, j) => (
          <path
            key={j}
            ref={(el) => {
              traceRefs.current[j] = el;
            }}
            d={tr.d}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeDasharray={tr.total}
            strokeDashoffset={tr.total}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* epicycle chains; the whole group fades during pen-up hops */}
        <g ref={chainGroupRef} style={{ opacity: init.opacity }}>
          {renderChain(init.x, circleRefs, vectorRefs, axes ? VIOLET : color)}
          {init.y && renderChain(init.y, circleRefsY, vectorRefsY, color)}
          {init.y && (
            <>
              <line ref={guideXRef} x1={f1(init.x.tip[0])} y1={f1(init.x.tip[1])} x2={f1(init.pen[0])} y2={f1(init.pen[1])} stroke={VIOLET} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="4 5" />
              <line ref={guideYRef} x1={f1(init.y.tip[0])} y1={f1(init.y.tip[1])} x2={f1(init.pen[0])} y2={f1(init.pen[1])} stroke={color} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="4 5" />
              <circle ref={tipXRef} cx={f1(init.x.tip[0])} cy={f1(init.x.tip[1])} r={2.5} fill={VIOLET} />
              <circle ref={tipYRef} cx={f1(init.y.tip[0])} cy={f1(init.y.tip[1])} r={2.5} fill={color} />
            </>
          )}
        </g>

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
