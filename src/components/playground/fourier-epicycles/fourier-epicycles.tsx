"use client";

import type { ReactNode } from "react";
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

const INK = "#18181b";
const ROSE = "#b95f65";
const ROSE_LIGHT = "#df8f93";
const VIOLET = "#7d6fae";
const SERIF = "ivypresto-headline, 'Times New Roman', Georgia, serif";

const VIEW_W = 640;
const VIEW_H = 320;
const CX = 100; // fixed center of the first epicycle
const CY = 160;
const OX = 210; // wave origin on the x axis
const N_SAMPLES = 2000;

/** One sinusoid a·sin(f·x + p) rendered as one spinning circle. */
export interface SeriesTerm {
  a: number;
  f: number;
  p?: number;
}

function evalSeries(x: number, terms: SeriesTerm[], count: number): number {
  let y = 0;
  for (let k = 0; k < count; k++) {
    y += terms[k].a * Math.sin(terms[k].f * x + (terms[k].p ?? 0));
  }
  return y;
}

// Positions of every epicycle (center, radius, vector tip) at time t.
// A negative amplitude becomes a π phase flip so the chain stays a plain sum.
function chainAt(t: number, terms: SeriesTerm[], count: number, scale: number) {
  const segs: Array<{ cx: number; cy: number; r: number; tx: number; ty: number }> = [];
  let px = CX;
  let py = CY;
  for (let k = 0; k < count; k++) {
    const { a, f, p = 0 } = terms[k];
    const r = Math.abs(a) * scale;
    const angle = f * t + p + (a < 0 ? Math.PI : 0);
    const tx = px + r * Math.cos(angle);
    const ty = py - r * Math.sin(angle);
    segs.push({ cx: px, cy: py, r, tx, ty });
    px = tx;
    py = ty;
  }
  return { segs, tip: [px, py] as [number, number] };
}

export interface FourierEpicyclesProps {
  /** The sinusoids to sum; each renders as one circle in the chain. */
  terms: SeriesTerm[];
  /** Domain of x traced before looping. */
  xMax?: number;
  /** Static formula label shown under the figure. */
  formula?: ReactNode;
  /** Accent color for the traced wave and lead circle. */
  color?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  /** Playback speed in x-units per second. */
  speed?: number;
  className?: string;
}

export function FourierEpicycles({
  terms,
  xMax = 4 * Math.PI,
  formula,
  color = ROSE,
  autoPlay = true,
  showControls = true,
  speed = 0.6,
  className,
}: FourierEpicyclesProps) {
  const [playing, setPlaying] = useState(autoPlay);
  const [count, setCount] = useState(terms.length);

  const tRef = useRef(0);
  const traceRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<Array<SVGCircleElement | null>>([]);
  const vectorRefs = useRef<Array<SVGLineElement | null>>([]);
  const connectorRef = useRef<SVGLineElement>(null);
  const penDotRef = useRef<SVGCircleElement>(null);
  const tipDotRef = useRef<SVGCircleElement>(null);

  const sx = (620 - OX) / xMax;

  const model = useMemo(() => {
    const ys = new Array<number>(N_SAMPLES);
    let maxAbs = 0;
    for (let i = 0; i < N_SAMPLES; i++) {
      const y = evalSeries((i / (N_SAMPLES - 1)) * xMax, terms, count);
      ys[i] = y;
      maxAbs = Math.max(maxAbs, Math.abs(y));
    }
    // Fit both the wave height and the worst-case chain reach.
    const sumAmp = terms
      .slice(0, count)
      .reduce((s, term) => s + Math.abs(term.a), 0);
    const scale = Math.min(120 / maxAbs, 100 / sumAmp, 18);
    const wave = buildViewPath(
      ys.map((y, i) => [OX + sx * (i / (N_SAMPLES - 1)) * xMax, CY - scale * y]),
    );
    return { scale, wave };
  }, [terms, count, xMax, sx]);

  const applyFrame = useCallback(
    (t: number) => {
      const u = t / xMax;
      if (traceRef.current) {
        traceRef.current.style.strokeDashoffset = `${model.wave.total - lengthAt(model.wave, u)}`;
      }
      const { segs, tip } = chainAt(t, terms, count, model.scale);
      for (let k = 0; k < segs.length; k++) {
        const c = circleRefs.current[k];
        const v = vectorRefs.current[k];
        const s = segs[k];
        if (c) {
          c.setAttribute("cx", s.cx.toFixed(1));
          c.setAttribute("cy", s.cy.toFixed(1));
        }
        if (v) {
          v.setAttribute("x1", s.cx.toFixed(1));
          v.setAttribute("y1", s.cy.toFixed(1));
          v.setAttribute("x2", s.tx.toFixed(1));
          v.setAttribute("y2", s.ty.toFixed(1));
        }
      }
      const pen: [number, number] = [
        OX + sx * t,
        CY - model.scale * evalSeries(t, terms, count),
      ];
      if (connectorRef.current) {
        connectorRef.current.setAttribute("x1", tip[0].toFixed(1));
        connectorRef.current.setAttribute("y1", tip[1].toFixed(1));
        connectorRef.current.setAttribute("x2", pen[0].toFixed(1));
        connectorRef.current.setAttribute("y2", pen[1].toFixed(1));
      }
      if (tipDotRef.current) {
        tipDotRef.current.setAttribute("cx", tip[0].toFixed(1));
        tipDotRef.current.setAttribute("cy", tip[1].toFixed(1));
      }
      if (penDotRef.current) {
        penDotRef.current.setAttribute("cx", pen[0].toFixed(1));
        penDotRef.current.setAttribute("cy", pen[1].toFixed(1));
      }
    },
    [model, terms, count, sx, xMax],
  );

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
      tRef.current = (tRef.current + dt * speed) % xMax;
      applyFrame(tRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, xMax, applyFrame]);

  const init = chainAt(0, terms, count, model.scale);
  const initPen: [number, number] = [OX, CY - model.scale * evalSeries(0, terms, count)];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        role="img"
        aria-label="A sum of sine waves drawn by stacked rotating circles: each circle is one term and their combined tip traces the waveform"
      >
        <defs>
          <marker
            id="fe-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="9"
            markerHeight="9"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 Z" fill={INK} />
          </marker>
        </defs>

        {/* axes */}
        <line x1={OX - 16} y1={CY} x2={624} y2={CY} stroke={INK} strokeWidth={1.4} markerEnd="url(#fe-arrow)" />
        <line x1={OX} y1={VIEW_H - 12} x2={OX} y2={22} stroke={INK} strokeWidth={1.4} markerEnd="url(#fe-arrow)" />
        <text x={630} y={CY + 18} fontFamily={SERIF} fontStyle="italic" fontSize={17} fill={INK} textAnchor="end">x</text>
        <text x={OX - 10} y={34} fontFamily={SERIF} fontStyle="italic" fontSize={17} fill={INK} textAnchor="end">y</text>

        {/* full wave, faint */}
        <path d={model.wave.d} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={1.1} />

        {/* traced wave — revealed via dashoffset */}
        <path
          ref={traceRef}
          d={model.wave.d}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray={model.wave.total}
          strokeDashoffset={model.wave.total}
          strokeLinecap="round"
        />

        {/* epicycle chain: one circle per term */}
        {init.segs.map((s, k) => (
          <g key={k}>
            <circle
              ref={(el) => {
                circleRefs.current[k] = el;
              }}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="none"
              stroke={k === 0 ? color : INK}
              strokeOpacity={k === 0 ? 0.55 : 0.3}
              strokeWidth={k === 0 ? 1.3 : 1}
            />
            <line
              ref={(el) => {
                vectorRefs.current[k] = el;
              }}
              x1={s.cx}
              y1={s.cy}
              x2={s.tx}
              y2={s.ty}
              stroke={INK}
              strokeOpacity={0.6}
              strokeWidth={1.2}
            />
          </g>
        ))}

        {/* pen linkage */}
        <line
          ref={connectorRef}
          x1={init.tip[0]}
          y1={init.tip[1]}
          x2={initPen[0]}
          y2={initPen[1]}
          stroke={INK}
          strokeOpacity={0.35}
          strokeWidth={1}
          strokeDasharray="3 4"
        />
        <circle ref={tipDotRef} cx={init.tip[0]} cy={init.tip[1]} r={2.5} fill={VIOLET} />
        <circle ref={penDotRef} cx={initPen[0]} cy={initPen[1]} r={3} fill={ROSE_LIGHT} stroke={color} strokeWidth={1} />
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
            {terms.length > 1 && (
              <label className="flex grow items-center gap-3">
                <span className="w-14 font-ivypresto text-lg italic">terms</span>
                <Slider
                  value={[count]}
                  min={1}
                  max={terms.length}
                  step={1}
                  onValueChange={([v]) => setCount(v)}
                  aria-label="Number of terms"
                  className="[&>span:first-child]:h-1 [&>span:first-child]:bg-zinc-900/10 [&>span:first-child>span]:bg-[#b95f65] [&>span:last-child]:h-3.5 [&>span:last-child]:w-3.5 [&>span:last-child]:border-zinc-900/50 [&>span:last-child]:bg-[#f4f1ea]"
                />
                <span className="w-9 text-right font-nuvo text-xs tabular-nums text-zinc-500">{count}</span>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
