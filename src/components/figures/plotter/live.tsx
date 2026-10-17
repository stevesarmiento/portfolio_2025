"use client";

import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { asksForStillness, useReadout } from "@/components/iso/react/live";
import { type Flat, type SolidPaths } from "@/components/iso/iso-kit";
import { loadSvgOutline, type SvgOutline } from "@/components/playground/fourier-gallery/svg-outline";
import { faceMatrix } from "../shared/parts";
import { crankFrame, knobPointerFrame, needleFrame, towerFrame, tracePath, traceScreen, type TowerFrame } from "./frame";
import { GROW, MAX_TERMS, TWO_PI, errorOf, fmtError, iconModel, nextGrow, prettyName, readoutOf, type IconModel } from "./model";
import { CARD_C, CARD_FROM_X, CARD_TOP, CRANK, DISC_MAX, HEIGHT, ICON_SCALE, N_KNOB, P, TOGGLE_AUTO, TOGGLE_RUN, WIDTH, at, shift } from "./view";

const SPEED = 1.3; // radians of t per second
const MOST_DT = 1 / 30;
const SLIDE_TAU = 0.22;
const CRANK_TAU = 0.18;
const NEEDLE = [160, 18] as const;
const KNOB_DRAG_PX = 70; // viewBox px per doubling of N

interface SolidNodes {
  fill: SVGPathElement | null;
  shades: (SVGPathElement | null)[];
  top: SVGPathElement | null;
  crease: SVGPathElement | null;
  edge: SVGPathElement | null;
}

function solidNodes(g: SVGGElement | null): SolidNodes {
  return {
    fill: g?.querySelector(".iso-fill") ?? null,
    shades: [0, 1, 2, 3].map((i) => g?.querySelector(`.iso-shade[data-shade="${i}"]`) ?? null),
    top: g?.querySelector(".iso-top") ?? null,
    crease: g?.querySelector(".iso-crease") ?? null,
    edge: g?.querySelector(".iso-edge") ?? null,
  };
}

function applySolid(n: SolidNodes | undefined, paths: SolidPaths | null) {
  if (!n || !paths) return;
  n.fill?.setAttribute("d", paths.fill);
  paths.shades.forEach((d, i) => n.shades[i]?.setAttribute("d", d));
  n.top?.setAttribute("d", paths.top);
  n.crease?.setAttribute("d", paths.crease);
  n.edge?.setAttribute("d", paths.outline);
}

function SolidSlot({
  tone,
  crease = "faint",
  lit,
  className,
  bind,
}: {
  tone: "hi" | "mid" | "lo";
  crease?: "faint" | "lo" | "none";
  lit?: boolean;
  className?: string;
  bind: (g: SVGGElement | null) => void;
}) {
  return (
    <g className={className ? `iso-solid ${className}` : "iso-solid"} data-lit={lit ? "" : undefined} ref={bind}>
      <path className="iso-fill" d="" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} className="iso-shade" data-shade={i} d="" />
      ))}
      <path className="iso-top" d="" />
      {crease === "none" ? null : <path className="iso-line iso-crease" data-tone={crease} d="" />}
      <path className="iso-line iso-edge" data-tone={tone} d="" />
    </g>
  );
}

interface DiscNodes {
  group: SVGGElement | null;
  disc: SolidNodes;
  spoke: SVGPathElement | null;
  hub: SVGPathElement | null;
  pivot: SVGPathElement | null;
}

interface TowerNodes {
  collar: SolidNodes;
  discs: DiscNodes[];
  holder: SolidNodes;
  arm: SVGPathElement | null;
  pen: SVGPathElement | null;
  penDot: SVGCircleElement | null;
  trace: SVGPathElement | null;
}

const emptyDisc = (): DiscNodes => ({ group: null, disc: solidNodes(null), spoke: null, hub: null, pivot: null });
const emptyTower = (): TowerNodes => ({
  collar: solidNodes(null),
  discs: Array.from({ length: DISC_MAX }, emptyDisc),
  holder: solidNodes(null),
  arm: null,
  pen: null,
  penDot: null,
  trace: null,
});

function applyTower(n: TowerNodes, f: TowerFrame, trace: string) {
  applySolid(n.collar, f.collar);
  for (let j = 0; j < DISC_MAX; j++) {
    const d = n.discs[j];
    const fr = f.discs[j];
    if (!d.group) continue;
    if (!fr.shown) {
      if (d.group.style.display !== "none") d.group.style.display = "none";
      continue;
    }
    if (d.group.style.display) d.group.style.display = "";
    applySolid(d.disc, fr.disc);
    d.spoke?.setAttribute("d", fr.spoke);
    d.hub?.setAttribute("d", fr.hub);
    d.pivot?.setAttribute("d", fr.pivot);
  }
  applySolid(n.holder, f.holder);
  n.arm?.setAttribute("d", f.arm);
  n.pen?.setAttribute("d", f.pen);
  n.penDot?.setAttribute("cx", `${Math.round(f.penDot[0] * 10) / 10}`);
  n.penDot?.setAttribute("cy", `${Math.round(f.penDot[1] * 10) / 10}`);
  n.trace?.setAttribute("d", trace);
}

interface Icon {
  file: string;
  outline: SvgOutline;
  model: IconModel;
}

interface Props {
  files: string[];
  label: string;
  base: React.ReactNode;
  magazine: React.ReactNode;
  tray: React.ReactNode;
  bed: React.ReactNode;
  card: React.ReactNode;
  clips: React.ReactNode;
  controls: React.ReactNode;
  toggles: { autoOn: React.ReactNode; autoOff: React.ReactNode; runOn: React.ReactNode; runOff: React.ReactNode };
  dial: React.ReactNode;
  counterMatrix: string;
  dialLabel: string;
}

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const dist = (a: Flat, b: Flat) => Math.hypot(a[0] - b[0], a[1] - b[1]);

const KNOB_AT = at([N_KNOB[0], N_KNOB[1], 3]);
const CRANK_AT = at([CRANK[0], CRANK[1], 3]);
const AUTO_AT = at([TOGGLE_AUTO[0], TOGGLE_AUTO[1], 3]);
const RUN_AT = at([TOGGLE_RUN[0], TOGGLE_RUN[1], 3]);

const counterText = (index: number, total: number) => `${String(index + 1).padStart(3, "0")} / ${String(total).padStart(3, "0")}`;

export function PlotterLive(props: Props) {
  const { files } = props;
  const { anchor, say } = useReadout<HTMLDivElement>();
  const root = React.useRef<HTMLDivElement | null>(null);

  const [index, setIndex] = React.useState(0);
  const [icon, setIcon] = React.useState<Icon | null>(null);
  const [auto, setAuto] = React.useState(true);
  const [running, setRunning] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [nShown, setNShown] = React.useState(GROW[0]);

  const cache = React.useRef(new Map<string, Promise<SvgOutline>>());
  const towers = React.useRef<TowerNodes[]>([]);
  const traces = React.useRef<Flat[][]>([]);
  const cardGroup = React.useRef<SVGGElement | null>(null);
  const knobPointer = React.useRef<SVGPathElement | null>(null);
  const crankArm = React.useRef<SolidNodes>(solidNodes(null));
  const crankHandle = React.useRef<SolidNodes>(solidNodes(null));
  const needle = React.useRef<SVGPathElement | null>(null);
  const counter = React.useRef<SVGTextElement | null>(null);

  const s = React.useRef({
    t: 0,
    count: GROW[0],
    slide: 0,
    crank: 0,
    crankGoal: 0,
    needle: { at: 0, rate: 0 },
    error: 0,
    frame: 0,
    last: 0,
    file: "",
  });
  const autoRef = React.useRef(auto);
  autoRef.current = auto;
  const runningRef = React.useRef(running);
  runningRef.current = running;
  const iconRef = React.useRef<Icon | null>(null);
  iconRef.current = icon;
  const indexRef = React.useRef(index);
  indexRef.current = index;

  const load = React.useCallback((file: string) => {
    let p = cache.current.get(file);
    if (!p) {
      p = loadSvgOutline(`/svgs/${file}`);
      cache.current.set(file, p);
    }
    return p;
  }, []);

  // Load the current card and warm the next one.
  React.useEffect(() => {
    const file = files[index];
    if (!file) return;
    let cancelled = false;
    load(file)
      .then((outline) => {
        if (cancelled) return;
        setIcon({ file, outline, model: iconModel(outline.contours) });
      })
      .catch(() => {});
    const next = files[(index + 1) % files.length];
    if (next) load(next).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [files, index, load]);

  // A new card: reset the loop, slide it in from the magazine, rebuild the traces.
  const retrace = React.useCallback((model: IconModel, count: number) => {
    traces.current = model.towers.map((tower) => traceScreen(tower, count));
    s.current.error = errorOf(model, count);
  }, []);

  React.useLayoutEffect(() => {
    if (!icon) return;
    const st = s.current;
    if (st.file !== icon.file) {
      st.file = icon.file;
      st.t = 0;
      st.count = GROW[0];
      st.slide = st.file ? CARD_FROM_X : 0;
      setNShown(GROW[0]);
    }
    retrace(icon.model, st.count);
    towers.current = icon.model.towers.map((_, i) => towers.current[i] ?? emptyTower());
  }, [icon, retrace]);

  const draw = React.useCallback(() => {
    const st = s.current;
    const current = iconRef.current;
    cardGroup.current?.setAttribute("transform", shift(st.slide));
    if (current) {
      const u = st.t / TWO_PI;
      current.model.towers.forEach((tower, i) => {
        const n = towers.current[i];
        if (!n) return;
        const f = towerFrame(tower, st.count, st.t);
        applyTower(n, f, tracePath(traces.current[i] ?? [], u, f.penDot));
      });
      say(readoutOf(current.file, st.count, st.error));
    }
    knobPointer.current?.setAttribute("d", knobPointerFrame(st.count));
    const crank = crankFrame(st.crank);
    applySolid(crankArm.current, crank.arm);
    applySolid(crankHandle.current, crank.handle);
    needle.current?.setAttribute("d", needleFrame(st.needle.at));
    if (counter.current) {
      const text = counterText(indexRef.current, files.length);
      if (counter.current.textContent !== text) counter.current.textContent = text;
    }
  }, [files.length, say]);

  const setCount = React.useCallback(
    (count: number) => {
      const st = s.current;
      const next = clamp(Math.round(count), 1, MAX_TERMS);
      if (next === st.count) return;
      st.count = next;
      const current = iconRef.current;
      if (current) retrace(current.model, next);
      setNShown(next);
    },
    [retrace],
  );

  const advance = React.useCallback((delta: number) => {
    s.current.crankGoal += delta * TWO_PI;
    setIndex((i) => (i + delta + files.length) % files.length);
  }, [files.length]);

  const stop = React.useCallback(() => {
    cancelAnimationFrame(s.current.frame);
    s.current.frame = 0;
  }, []);

  const run = React.useCallback(() => {
    const st = s.current;
    if (st.frame) return;
    st.last = 0;
    const tick = (now: number) => {
      const dt = st.last ? Math.min((now - st.last) / 1000, MOST_DT) : 1 / 60;
      st.last = now;
      const calm = asksForStillness();
      if (runningRef.current && iconRef.current) {
        const next = st.t + dt * SPEED;
        if (next >= TWO_PI) {
          st.t = next - TWO_PI;
          if (autoRef.current) {
            const { next: grown, wrapped } = nextGrow(st.count);
            if (wrapped) advance(1);
            else setCount(grown);
          }
        } else st.t = next;
      }
      const ease = (tau: number) => (calm ? 1 : 1 - Math.exp(-dt / tau));
      st.slide += (0 - st.slide) * ease(SLIDE_TAU);
      if (Math.abs(st.slide) < 0.05) st.slide = 0;
      st.crank += (st.crankGoal - st.crank) * ease(CRANK_TAU);
      if (Math.abs(st.crankGoal - st.crank) < 0.002) st.crank = st.crankGoal;
      const target = st.error;
      const n = st.needle;
      const [k, c] = NEEDLE;
      const drag = calm ? 2 * Math.sqrt(k) : c;
      const steps = Math.max(1, Math.ceil(dt * 240));
      const slice = dt / steps;
      for (let i = 0; i < steps; i++) {
        n.rate += (target - n.at) * k * slice - n.rate * drag * slice;
        n.at += n.rate * slice;
      }
      draw();
      st.frame = requestAnimationFrame(tick);
    };
    st.frame = requestAnimationFrame(tick);
  }, [advance, draw, setCount]);

  React.useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => setVisible(Boolean(entries.at(-1)?.isIntersecting)), { rootMargin: "120px 0px" });
    observer.observe(node);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [stop]);

  React.useEffect(() => {
    if (visible) run();
    else stop();
  }, [visible, run, stop, icon]);

  React.useLayoutEffect(() => {
    draw();
  }, [draw, icon]);

  // Pointer: drag the N knob, click the crank or a toggle.
  const drag = React.useRef<{ x: number; exp: number } | null>(null);
  const viewPoint = (event: React.PointerEvent): Flat | null => {
    const svg = root.current?.querySelector("svg");
    const box = svg?.getBoundingClientRect();
    if (!box || !box.width) return null;
    return [((event.clientX - box.left) / box.width) * WIDTH, ((event.clientY - box.top) / box.height) * HEIGHT];
  };

  const bindTower = (i: number) => ({
    collar: (g: SVGGElement | null) => {
      const t = (towers.current[i] ??= emptyTower());
      t.collar = solidNodes(g);
    },
    disc: (j: number) => (g: SVGGElement | null) => {
      const t = (towers.current[i] ??= emptyTower());
      t.discs[j].group = g;
      t.discs[j].disc = solidNodes(g?.querySelector(".iso-solid") ?? null);
      t.discs[j].spoke = g?.querySelector(".plotter-spoke") ?? null;
      t.discs[j].hub = g?.querySelector(".plotter-hub") ?? null;
      t.discs[j].pivot = g?.querySelector(".plotter-pivot") ?? null;
    },
    holder: (g: SVGGElement | null) => {
      const t = (towers.current[i] ??= emptyTower());
      t.holder = solidNodes(g);
    },
    arm: (el: SVGPathElement | null) => {
      (towers.current[i] ??= emptyTower()).arm = el;
    },
    pen: (el: SVGPathElement | null) => {
      (towers.current[i] ??= emptyTower()).pen = el;
    },
    penDot: (el: SVGCircleElement | null) => {
      (towers.current[i] ??= emptyTower()).penDot = el;
    },
    trace: (el: SVGPathElement | null) => {
      (towers.current[i] ??= emptyTower()).trace = el;
    },
  });

  const model = icon?.model ?? null;
  const svgCenter: Flat = model ? [model.center[0], -model.center[1]] : [16, 16];
  const silhouetteScale = model ? ICON_SCALE / model.height : 1;
  const spoken = icon
    ? `${prettyName(icon.file)}, card ${index + 1} of ${files.length}, ${nShown} circles, error ${fmtError(s.current.error)} percent`
    : "Loading the first card";

  return (
    <div
      ref={(node) => {
        root.current = node;
        anchor.current = node;
      }}
      className="plotter"
      role="slider"
      tabIndex={0}
      aria-label="Icon plotter: drag the knob or use up and down arrows for the number of circles, left and right arrows for the next card, Space to pause, A for auto"
      aria-valuemin={1}
      aria-valuemax={MAX_TERMS}
      aria-valuenow={nShown}
      aria-valuetext={spoken}
      data-dragging={dragging ? "" : undefined}
      onPointerDown={(event) => {
        const p = viewPoint(event);
        if (!p) return;
        if (dist(p, KNOB_AT) < 18) {
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { x: p[0], exp: Math.log2(s.current.count) };
          setDragging(true);
          setAuto(false);
        } else if (dist(p, CRANK_AT) < 16) {
          advance(p[0] < CRANK_AT[0] - 2 ? -1 : 1);
        } else if (dist(p, AUTO_AT) < 11) {
          setAuto((a) => !a);
        } else if (dist(p, RUN_AT) < 11) {
          setRunning((r) => !r);
        }
      }}
      onPointerMove={(event) => {
        const d = drag.current;
        if (!d || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const p = viewPoint(event);
        if (!p) return;
        setCount(Math.pow(2, clamp(d.exp + (p[0] - d.x) / KNOB_DRAG_PX, 0, 7)));
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        drag.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
      onKeyDown={(event) => {
        const st = s.current;
        switch (event.key) {
          case "ArrowRight":
            advance(1);
            break;
          case "ArrowLeft":
            advance(-1);
            break;
          case "ArrowUp":
            setAuto(false);
            setCount(Math.min(MAX_TERMS, st.count * 2));
            break;
          case "ArrowDown":
            setAuto(false);
            setCount(Math.max(1, Math.round(st.count / 2)));
            break;
          case "Home":
            setIndex(0);
            break;
          case "End":
            setIndex(files.length - 1);
            break;
          case " ":
          case "Enter":
            if (event.repeat) return;
            setRunning((r) => !r);
            break;
          case "a":
          case "A":
            setAuto((a) => !a);
            break;
          default:
            return;
        }
        event.preventDefault();
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        {props.base}
        {props.magazine}
        {props.tray}
        {props.bed}
        <g ref={cardGroup} className="plotter-card" transform={shift(0)}>
          {props.card}
          {model && icon ? (
            <g transform={faceMatrix(P, CARD_C, CARD_TOP + 0.05)}>
              <g transform={`scale(${silhouetteScale}) translate(${-svgCenter[0]} ${-svgCenter[1]})`}>
                {icon.outline.paths.map((p, i) => (
                  <path key={i} className="plotter-silhouette" d={p.d} fillRule={p.fillRule ?? "nonzero"} />
                ))}
              </g>
            </g>
          ) : null}
          {model
            ? model.towers.map((_, i) => {
                const bind = bindTower(i);
                return (
                  <g key={`${icon?.file}-${i}`} className="plotter-tower">
                    <path ref={bind.trace} className="iso-line plotter-trace" data-tone="lit" d="" />
                    <SolidSlot tone="mid" bind={bind.collar} />
                    {Array.from({ length: DISC_MAX }, (_, j) => (
                      <g key={j} ref={bind.disc(j)} style={{ display: "none" }}>
                        <SolidSlot tone={j === 0 ? "hi" : "mid"} crease="lo" className="plotter-disc" bind={() => {}} />
                        <path className="iso-line plotter-spoke" data-tone="mid" d="" />
                        <path className="iso-line plotter-hub" data-tone="lo" d="" />
                        <path className="iso-line plotter-pivot" data-tone="lo" d="" />
                      </g>
                    ))}
                    <SolidSlot tone="mid" bind={bind.holder} />
                    <path ref={bind.arm} className="iso-line" data-tone="mid" d="" />
                    <path ref={bind.pen} className="iso-line" data-tone="lit" d="" />
                    <circle ref={bind.penDot} className="plotter-pen" r={1.4} cx={0} cy={0} />
                  </g>
                );
              })
            : null}
        </g>
        {props.clips}
        {props.controls}
        <path ref={knobPointer} className="iso-line" data-tone="hi" data-free="end" d={knobPointerFrame(GROW[0])} style={{ strokeWidth: 1.1 }} />
        <SolidSlot tone="mid" bind={(g) => (crankArm.current = solidNodes(g))} />
        <SolidSlot tone="mid" bind={(g) => (crankHandle.current = solidNodes(g))} />
        <g style={{ display: auto ? "" : "none" }}>{props.toggles.autoOn}</g>
        <g style={{ display: auto ? "none" : "" }}>{props.toggles.autoOff}</g>
        <g style={{ display: running ? "" : "none" }}>{props.toggles.runOn}</g>
        <g style={{ display: running ? "none" : "" }}>{props.toggles.runOff}</g>
        <text ref={counter} className="iso-face-text plotter-counter" transform={props.counterMatrix} fontSize={3.4} textAnchor="middle">
          {counterText(index, files.length)}
        </text>
        {props.dial}
        <text className="iso-face-text" data-tone="lo" transform={props.dialLabel} fontSize={2.4} textAnchor="middle">
          %
        </text>
        <path ref={needle} className="plotter-needle" d={needleFrame(0)} />
      </IsoFigure>
    </div>
  );
}
