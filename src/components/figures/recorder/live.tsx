"use client";

import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { asksForStillness, useReadout } from "@/components/iso/react/live";
import type { Flat } from "@/components/iso/iso-kit";
import { SolidSlot, applySolid, setD, show, solidNodes, type SolidNodes } from "../shared/slots";
import { sprocketDots } from "./geometry";
import { penOnPaper, selPointer, termsPointer, towerFrame, tracePath, traceScreen, type TowerFrame } from "./frame";
import { MAX_TERMS, PRESETS, evalSeries, readoutOf, scaleOf } from "./model";
import { AMP, DISC_MAX, HEIGHT, RUN_TOGGLE, SEL_KNOB, STRIP, SX, TERMS_KNOB, WIDTH, at, shift } from "./view";

const MOST_DT = 1 / 30;
const TOUR_EVERY = 11; // seconds between presets when nobody touches it
const IDLE_AFTER = 3.6;
const KNOB_DRAG_PX = 40; // viewBox px per step of the terms knob
const SEL_DRAG_PX = 36;

interface DiscNodes {
  group: SVGGElement | null;
  disc: SolidNodes;
  spoke: SVGPathElement | null;
  hub: SVGPathElement | null;
  pivot: SVGPathElement | null;
}

const emptyDisc = (): DiscNodes => ({ group: null, disc: solidNodes(null), spoke: null, hub: null, pivot: null });

interface Props {
  label: string;
  base: React.ReactNode;
  motor: React.ReactNode;
  paper: React.ReactNode;
  bridgeBack: React.ReactNode;
  bridgeFront: React.ReactNode;
  carriage: React.ReactNode;
  controls: React.ReactNode;
  runOn: React.ReactNode;
  runOff: React.ReactNode;
  clipPath: string;
}

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const dist = (a: Flat, b: Flat) => Math.hypot(a[0] - b[0], a[1] - b[1]);

const SEL_AT = at([SEL_KNOB[0], SEL_KNOB[1], 3]);
const TERMS_AT = at([TERMS_KNOB[0], TERMS_KNOB[1], 3]);
const RUN_AT = at([RUN_TOGGLE[0], RUN_TOGGLE[1], 3]);

// Sprocket holes over the longest stretch of paper any preset can scroll.
const LONGEST = Math.max(...PRESETS.map((p) => p.xMax)) * SX;
const INITIAL_SCALE = scaleOf(PRESETS[0], PRESETS[0].terms.length, AMP);
const INITIAL_TRACE = traceScreen(PRESETS[0], PRESETS[0].terms.length, INITIAL_SCALE);
// Paper-fixed x that ever shows through the strip while it scrolls right by up to LONGEST.
const SPROCKETS = sprocketDots(STRIP.x - LONGEST - 12, STRIP.x + STRIP.w + 12);

export function RecorderLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();

  const [presetIndex, setPresetIndex] = React.useState(0);
  const [count, setCountState] = React.useState(PRESETS[0].terms.length);
  const [running, setRunning] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const preset = PRESETS[presetIndex];
  const s = React.useRef({
    x: 0,
    scale: INITIAL_SCALE,
    idle: 0,
    frame: 0,
    last: 0,
    presetIndex: 0,
    count: PRESETS[0].terms.length,
  });
  const runningRef = React.useRef(running);
  React.useLayoutEffect(() => {
    runningRef.current = running;
  }, [running]);
  const traces = React.useRef<Flat[]>(INITIAL_TRACE);

  const discs = React.useRef<DiscNodes[]>(Array.from({ length: DISC_MAX }, emptyDisc));
  const holder = React.useRef<SolidNodes>(solidNodes(null));
  const arm = React.useRef<SVGPathElement | null>(null);
  const pin = React.useRef<SVGPathElement | null>(null);
  const link = React.useRef<SVGPathElement | null>(null);
  const carriage = React.useRef<SVGGElement | null>(null);
  const scroll = React.useRef<SVGGElement | null>(null);
  const trace = React.useRef<SVGPathElement | null>(null);
  const penDot = React.useRef<SVGCircleElement | null>(null);
  const selNeedle = React.useRef<SVGPathElement | null>(null);
  const termsNeedle = React.useRef<SVGPathElement | null>(null);

  // A preset or term change re-stacks the tower and re-plots the paper.
  const configure = React.useCallback((index: number, terms: number) => {
    const st = s.current;
    const p = PRESETS[index];
    const n = clamp(terms, 1, p.terms.length);
    st.presetIndex = index;
    st.count = n;
    st.scale = scaleOf(p, n, AMP);
    traces.current = traceScreen(p, n, st.scale);
    if (st.x > p.xMax) st.x = 0;
  }, []);

  React.useLayoutEffect(() => {
    configure(presetIndex, count);
  }, [presetIndex, count, configure]);

  const draw = React.useCallback(() => {
    const st = s.current;
    const p = PRESETS[st.presetIndex];
    const f: TowerFrame = towerFrame(p, st.count, st.x, st.scale);
    for (let j = 0; j < DISC_MAX; j++) {
      const d = discs.current[j];
      const fr = f.discs[j];
      show(d.group, fr.shown);
      if (!fr.shown) continue;
      applySolid(d.disc, fr.disc);
      setD(d.spoke, fr.spoke);
      setD(d.hub, fr.hub);
      setD(d.pivot, fr.pivot);
    }
    applySolid(holder.current, f.holder);
    setD(arm.current, f.arm);
    setD(pin.current, f.pin);
    setD(link.current, f.link);
    carriage.current?.setAttribute("transform", shift(0, f.penY));
    scroll.current?.setAttribute("transform", shift(st.x * SX));
    const y = evalSeries(st.x, p.terms, st.count);
    const pen = penOnPaper(st.x, y, st.scale);
    setD(trace.current, tracePath(traces.current, st.x / p.xMax, pen));
    if (penDot.current) {
      penDot.current.setAttribute("cx", `${Math.round(pen[0] * 10) / 10}`);
      penDot.current.setAttribute("cy", `${Math.round(pen[1] * 10) / 10}`);
    }
    setD(selNeedle.current, selPointer(st.presetIndex, PRESETS.length));
    setD(termsNeedle.current, termsPointer(st.count, MAX_TERMS));
    say(readoutOf(p, st.count, st.x));
  }, [say]);

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
      const p = PRESETS[st.presetIndex];
      const calm = asksForStillness();
      if (runningRef.current && !calm) {
        st.x += dt * p.speed;
        if (st.x >= p.xMax) st.x -= p.xMax;
        {
          st.idle += dt;
          if (st.idle > IDLE_AFTER + TOUR_EVERY) {
            st.idle = IDLE_AFTER;
            setPresetIndex((i) => (i + 1) % PRESETS.length);
            setCountState(PRESETS[(st.presetIndex + 1) % PRESETS.length].terms.length);
          }
        }
      }
      draw();
      st.frame = requestAnimationFrame(tick);
    };
    st.frame = requestAnimationFrame(tick);
  }, [draw]);

  React.useEffect(() => {
    const node = anchor.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => setVisible(Boolean(entries.at(-1)?.isIntersecting)), { rootMargin: "120px 0px" });
    observer.observe(node);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [anchor, stop]);

  React.useEffect(() => {
    if (visible) run();
    else stop();
  }, [visible, run, stop]);

  React.useLayoutEffect(() => {
    draw();
  }, [draw, presetIndex, count]);

  const wake = () => {
    s.current.idle = 0;
  };
  const choosePreset = (index: number) => {
    const next = ((index % PRESETS.length) + PRESETS.length) % PRESETS.length;
    wake();
    setPresetIndex(next);
    setCountState(PRESETS[next].terms.length);
  };
  const chooseTerms = (terms: number) => {
    wake();
    setCountState(clamp(Math.round(terms), 1, preset.terms.length));
  };

  const drag = React.useRef<{ knob: "sel" | "terms"; x: number; from: number } | null>(null);
  const viewPoint = (event: React.PointerEvent): Flat | null => {
    const svg = anchor.current?.querySelector("svg");
    const box = svg?.getBoundingClientRect();
    if (!box || !box.width) return null;
    return [((event.clientX - box.left) / box.width) * WIDTH, ((event.clientY - box.top) / box.height) * HEIGHT];
  };

  const bindDisc = (j: number) => (g: SVGGElement | null) => {
    const d = discs.current[j];
    d.group = g;
    d.disc = solidNodes(g?.querySelector(".iso-solid") ?? null);
    d.spoke = g?.querySelector(".recorder-spoke") ?? null;
    d.hub = g?.querySelector(".recorder-hub") ?? null;
    d.pivot = g?.querySelector(".recorder-pivot") ?? null;
  };

  const spoken = `${preset.name}, ${count} of ${preset.terms.length} terms, ${running ? "recording" : "paused"}`;

  return (
    <div
      ref={anchor}
      className="recorder"
      role="slider"
      tabIndex={0}
      aria-label="Harmonic recorder: left and right arrows change the series, up and down arrows change the number of terms, Space pauses"
      aria-valuemin={1}
      aria-valuemax={preset.terms.length}
      aria-valuenow={count}
      aria-valuetext={spoken}
      data-dragging={dragging ? "" : undefined}
      onPointerDown={(event) => {
        const p = viewPoint(event);
        if (!p) return;
        if (dist(p, SEL_AT) < 18) {
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { knob: "sel", x: p[0], from: presetIndex };
          setDragging(true);
          wake();
        } else if (dist(p, TERMS_AT) < 16) {
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { knob: "terms", x: p[0], from: count };
          setDragging(true);
          wake();
        } else if (dist(p, RUN_AT) < 11) {
          wake();
          setRunning((r) => !r);
        }
      }}
      onPointerMove={(event) => {
        const d = drag.current;
        if (!d || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const p = viewPoint(event);
        if (!p) return;
        if (d.knob === "sel") {
          const next = clamp(Math.round(d.from + (p[0] - d.x) / SEL_DRAG_PX), 0, PRESETS.length - 1);
          if (next !== presetIndex) choosePreset(next);
        } else chooseTerms(d.from + (p[0] - d.x) / KNOB_DRAG_PX);
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
        switch (event.key) {
          case "ArrowRight":
            choosePreset(presetIndex + 1);
            break;
          case "ArrowLeft":
            choosePreset(presetIndex - 1);
            break;
          case "ArrowUp":
            chooseTerms(count + 1);
            break;
          case "ArrowDown":
            chooseTerms(count - 1);
            break;
          case "Home":
            chooseTerms(1);
            break;
          case "End":
            chooseTerms(preset.terms.length);
            break;
          case " ":
          case "Enter":
            if (event.repeat) return;
            wake();
            setRunning((r) => !r);
            break;
          default:
            return;
        }
        event.preventDefault();
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        <defs>
          <clipPath id="recorder-paper">
            <path d={props.clipPath} />
          </clipPath>
        </defs>
        {props.base}
        {props.paper}
        <g clipPath="url(#recorder-paper)">
          <g ref={scroll}>
            <g className="iso-dots" data-tone="lo">
              {SPROCKETS.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={0.7} />
              ))}
            </g>
            <path ref={trace} className="iso-line recorder-trace" data-tone="lit" data-free="start" d="" />
            <circle ref={penDot} className="recorder-pen" r={1.3} cx={0} cy={0} />
          </g>
        </g>
        {props.bridgeBack}
        <g ref={carriage} transform={shift(0, 0)}>
          {props.carriage}
        </g>
        {props.bridgeFront}
        {props.motor}
        <g className="recorder-tower">
          {Array.from({ length: DISC_MAX }, (_, j) => (
            <g key={j} ref={bindDisc(j)} style={{ display: "none" }}>
              <SolidSlot tone={j === 0 ? "hi" : "mid"} crease="lo" className="recorder-disc" bind={() => {}} />
              <path className="iso-line recorder-spoke" data-tone="mid" d="" />
              <path className="iso-line recorder-hub" data-tone="lo" d="" />
              <path className="iso-line recorder-pivot" data-tone="lo" d="" />
            </g>
          ))}
          <SolidSlot tone="mid" bind={(g) => (holder.current = solidNodes(g))} />
          <path ref={arm} className="iso-line" data-tone="mid" d="" />
          <path ref={pin} className="iso-line" data-tone="lo" d="" />
        </g>
        <path ref={link} className="iso-line" data-tone="hi" d="" />
        {props.controls}
        <path ref={selNeedle} className="iso-line" data-tone="hi" data-free="end" d={selPointer(0, PRESETS.length)} style={{ strokeWidth: 1.1 }} />
        <path ref={termsNeedle} className="iso-line" data-tone="hi" data-free="end" d={termsPointer(PRESETS[0].terms.length, MAX_TERMS)} style={{ strokeWidth: 1.1 }} />
        <g style={{ display: running ? "" : "none" }}>{props.runOn}</g>
        <g style={{ display: running ? "none" : "" }}>{props.runOff}</g>
      </IsoFigure>
    </div>
  );
}
