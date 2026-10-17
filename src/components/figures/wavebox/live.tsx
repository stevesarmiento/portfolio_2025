"use client";

import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { asksForStillness, useReadout } from "@/components/iso/react/live";
import type { Flat } from "@/components/iso/iso-kit";
import { setD } from "../shared/slots";
import { curvesOf, gammaPointer, momentOf, needleFrame, omegaPointer, type Curves } from "./frame";
import { GAMMA_DEFAULT, GAMMA_RANGE, OMEGA_DEFAULT, OMEGA_RANGE, SWEEP, T_MAX, magnitudeOf, readoutOf } from "./model";
import { GAMMA_KNOB, HEIGHT, OMEGA_KNOB, RAIL_Y, RUN_TOGGLE, WIDTH, X0, X1, at, shift, xToT } from "./view";

const MOST_DT = 1 / 30;
const RESUME_AFTER = 3.6;
const NEEDLE = [180, 20] as const;
const KNOB_DRAG_PX = 110; // viewBox px across a knob's whole range

interface Props {
  label: string;
  base: React.ReactNode;
  wall: React.ReactNode;
  panel: React.ReactNode;
  postBack: React.ReactNode;
  rod: React.ReactNode;
  postFront: React.ReactNode;
  rail: React.ReactNode;
  sled: React.ReactNode;
  controls: React.ReactNode;
  dial: React.ReactNode;
  dialLabel: string;
  runOn: React.ReactNode;
  runOff: React.ReactNode;
}

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const dist = (a: Flat, b: Flat) => Math.hypot(a[0] - b[0], a[1] - b[1]);

const OMEGA_AT = at([OMEGA_KNOB[0], OMEGA_KNOB[1], 3]);
const GAMMA_AT = at([GAMMA_KNOB[0], GAMMA_KNOB[1], 3]);
const RUN_AT = at([RUN_TOGGLE[0], RUN_TOGGLE[1], 3]);
const RAIL_LEFT = at([X0, RAIL_Y, 3]);
const RAIL_RIGHT = at([X1, RAIL_Y, 3]);
const INITIAL = curvesOf(OMEGA_DEFAULT, GAMMA_DEFAULT);

/** Where along the rail (in world x) a screen point lands, by projecting onto the rail's screen segment. */
function railX(p: Flat): number {
  const dx = RAIL_RIGHT[0] - RAIL_LEFT[0];
  const dy = RAIL_RIGHT[1] - RAIL_LEFT[1];
  const len2 = dx * dx + dy * dy || 1;
  const u = ((p[0] - RAIL_LEFT[0]) * dx + (p[1] - RAIL_LEFT[1]) * dy) / len2;
  return X0 + clamp(u, 0, 1) * (X1 - X0);
}

function railDistance(p: Flat): number {
  const dx = RAIL_RIGHT[0] - RAIL_LEFT[0];
  const dy = RAIL_RIGHT[1] - RAIL_LEFT[1];
  const len = Math.hypot(dx, dy) || 1;
  return Math.abs((p[0] - RAIL_LEFT[0]) * dy - (p[1] - RAIL_LEFT[1]) * dx) / len;
}

export function WaveBoxLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();

  const [omega, setOmega] = React.useState(OMEGA_DEFAULT);
  const [gamma, setGamma] = React.useState(GAMMA_DEFAULT);
  const [running, setRunning] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  // The time the reader chose, for aria; the sweep itself never re-renders.
  const [tChosen, setTChosen] = React.useState(0);

  const s = React.useRef({ t: 0, shown: 0, hold: 0, omega: OMEGA_DEFAULT, gamma: GAMMA_DEFAULT, needle: { at: 0, rate: 0 }, frame: 0, last: 0 });
  const curves = React.useRef<Curves>(INITIAL);
  const runningRef = React.useRef(running);
  React.useLayoutEffect(() => {
    runningRef.current = running;
  }, [running]);

  const helixFull = React.useRef<SVGPathElement | null>(null);
  const floorFull = React.useRef<SVGPathElement | null>(null);
  const wallFull = React.useRef<SVGPathElement | null>(null);
  const panelFull = React.useRef<SVGPathElement | null>(null);
  const helix = React.useRef<SVGPathElement | null>(null);
  const floor = React.useRef<SVGPathElement | null>(null);
  const wall = React.useRef<SVGPathElement | null>(null);
  const panel = React.useRef<SVGPathElement | null>(null);
  const dropFloor = React.useRef<SVGPathElement | null>(null);
  const dropWall = React.useRef<SVGPathElement | null>(null);
  const sledLine = React.useRef<SVGPathElement | null>(null);
  const point = React.useRef<SVGCircleElement | null>(null);
  const floorDot = React.useRef<SVGCircleElement | null>(null);
  const wallDot = React.useRef<SVGCircleElement | null>(null);
  const panelDot = React.useRef<SVGCircleElement | null>(null);
  const sled = React.useRef<SVGGElement | null>(null);
  const omegaNeedle = React.useRef<SVGPathElement | null>(null);
  const gammaNeedle = React.useRef<SVGPathElement | null>(null);
  const needle = React.useRef<SVGPathElement | null>(null);

  React.useLayoutEffect(() => {
    const st = s.current;
    st.omega = omega;
    st.gamma = gamma;
    curves.current = curvesOf(omega, gamma);
    setD(helixFull.current, curves.current.helixD);
    setD(floorFull.current, curves.current.floorD);
    setD(wallFull.current, curves.current.wallD);
    setD(panelFull.current, curves.current.panelD);
  }, [omega, gamma]);

  const placeDot = (el: SVGCircleElement | null, p: Flat) => {
    if (!el) return;
    el.setAttribute("cx", `${Math.round(p[0] * 10) / 10}`);
    el.setAttribute("cy", `${Math.round(p[1] * 10) / 10}`);
  };

  const draw = React.useCallback(() => {
    const st = s.current;
    const m = momentOf(curves.current, st.shown, st.omega, st.gamma);
    setD(helix.current, m.helix);
    setD(floor.current, m.floor);
    setD(wall.current, m.wall);
    setD(panel.current, m.panel);
    setD(dropFloor.current, m.dropFloor);
    setD(dropWall.current, m.dropWall);
    setD(sledLine.current, m.sledLine);
    placeDot(point.current, m.point);
    placeDot(floorDot.current, m.floorDot);
    placeDot(wallDot.current, m.wallDot);
    placeDot(panelDot.current, m.panelDot);
    sled.current?.setAttribute("transform", shift(m.sled));
    setD(omegaNeedle.current, omegaPointer(st.omega));
    setD(gammaNeedle.current, gammaPointer(st.gamma));
    setD(needle.current, needleFrame(st.needle.at));
    say(readoutOf(st.shown, st.omega, st.gamma));
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
      const calm = asksForStillness();
      if (st.hold > 0) st.hold -= dt;
      else if (runningRef.current) {
        st.t += dt * SWEEP;
        if (st.t > T_MAX) st.t -= T_MAX;
      }
      // The shown t eases toward the target so a dragged sled never jumps.
      const ease = calm ? 1 : 1 - Math.exp(-dt / 0.12);
      const gap = st.t - st.shown;
      st.shown += (Math.abs(gap) > T_MAX / 2 ? gap - Math.sign(gap) * T_MAX : gap) * ease;
      if (st.shown < 0) st.shown += T_MAX;
      if (st.shown > T_MAX) st.shown -= T_MAX;
      if (Math.abs(st.t - st.shown) < 1e-4) st.shown = st.t;
      const target = magnitudeOf(st.shown, st.omega, st.gamma);
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
  }, [draw, omega, gamma]);

  const drag = React.useRef<{ knob: "omega" | "gamma" | "sled"; x: number; from: number } | null>(null);
  const viewPoint = (event: React.PointerEvent): Flat | null => {
    const svg = anchor.current?.querySelector("svg");
    const box = svg?.getBoundingClientRect();
    if (!box || !box.width) return null;
    return [((event.clientX - box.left) / box.width) * WIDTH, ((event.clientY - box.top) / box.height) * HEIGHT];
  };
  const holdSweep = () => {
    s.current.hold = RESUME_AFTER;
  };
  const setT = (t: number) => {
    s.current.t = clamp(t, 0, T_MAX);
    setTChosen(Math.round(s.current.t * 100) / 100);
    holdSweep();
  };

  const spoken = `t ${tChosen.toFixed(2)} of ${T_MAX}, omega ${omega.toFixed(1)}, gamma ${gamma.toFixed(1)}, ${running ? "sweeping" : "paused"}`;

  return (
    <div
      ref={anchor}
      className="wavebox"
      role="slider"
      tabIndex={0}
      aria-label="Complex wave packet: left and right arrows move the time sled, up and down arrows change omega, Shift with up and down changes gamma, Space pauses"
      aria-valuemin={0}
      aria-valuemax={T_MAX}
      aria-valuenow={tChosen}
      aria-valuetext={spoken}
      data-dragging={dragging ? "" : undefined}
      onPointerDown={(event) => {
        const p = viewPoint(event);
        if (!p) return;
        const target = event.currentTarget;
        if (dist(p, OMEGA_AT) < 16) {
          target.setPointerCapture(event.pointerId);
          drag.current = { knob: "omega", x: p[0], from: omega };
          setDragging(true);
        } else if (dist(p, GAMMA_AT) < 16) {
          target.setPointerCapture(event.pointerId);
          drag.current = { knob: "gamma", x: p[0], from: gamma };
          setDragging(true);
        } else if (dist(p, RUN_AT) < 11) {
          setRunning((r) => !r);
        } else if (railDistance(p) < 22) {
          target.setPointerCapture(event.pointerId);
          drag.current = { knob: "sled", x: p[0], from: 0 };
          setDragging(true);
          setT(xToT(railX(p)));
        }
      }}
      onPointerMove={(event) => {
        const d = drag.current;
        if (!d || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const p = viewPoint(event);
        if (!p) return;
        if (d.knob === "sled") setT(xToT(railX(p)));
        else if (d.knob === "omega") setOmega(clamp(d.from + ((p[0] - d.x) / KNOB_DRAG_PX) * (OMEGA_RANGE[1] - OMEGA_RANGE[0]), OMEGA_RANGE[0], OMEGA_RANGE[1]));
        else setGamma(clamp(d.from + ((p[0] - d.x) / KNOB_DRAG_PX) * (GAMMA_RANGE[1] - GAMMA_RANGE[0]), GAMMA_RANGE[0], GAMMA_RANGE[1]));
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
        const stepT = event.shiftKey ? 0.25 : 0.05;
        switch (event.key) {
          case "ArrowRight":
            setT(st.t + stepT);
            break;
          case "ArrowLeft":
            setT(st.t - stepT);
            break;
          case "ArrowUp":
            if (event.shiftKey) setGamma((g) => clamp(g + 0.5, GAMMA_RANGE[0], GAMMA_RANGE[1]));
            else setOmega((w) => clamp(w + 1, OMEGA_RANGE[0], OMEGA_RANGE[1]));
            break;
          case "ArrowDown":
            if (event.shiftKey) setGamma((g) => clamp(g - 0.5, GAMMA_RANGE[0], GAMMA_RANGE[1]));
            else setOmega((w) => clamp(w - 1, OMEGA_RANGE[0], OMEGA_RANGE[1]));
            break;
          case "Home":
            setT(0);
            break;
          case "End":
            setT(T_MAX);
            break;
          case " ":
          case "Enter":
            if (event.repeat) return;
            setRunning((r) => !r);
            break;
          default:
            return;
        }
        event.preventDefault();
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>
        {props.base}
        {props.wall}
        <path ref={wallFull} className="iso-line" data-tone="lo" data-free d={INITIAL.wallD} />
        <path ref={wall} className="iso-line" data-tone="hi" data-free="start" d="" />
        <circle ref={wallDot} className="wavebox-dot" r={1.5} cx={0} cy={0} />
        <path ref={floorFull} className="iso-line" data-tone="lo" data-free d={INITIAL.floorD} />
        <path ref={floor} className="iso-line" data-tone="hi" data-free="start" d="" />
        <circle ref={floorDot} className="wavebox-dot" r={1.5} cx={0} cy={0} />
        <path ref={sledLine} className="iso-line" data-tone="lo" data-dashed d="" />
        {props.panel}
        <path ref={panelFull} className="iso-line" data-tone="lo" data-free d={INITIAL.panelD} />
        <path ref={panel} className="iso-line" data-tone="hi" data-free="start" d="" />
        <circle ref={panelDot} className="wavebox-dot" r={1.5} cx={0} cy={0} />
        {props.postBack}
        {props.rod}
        <path ref={helixFull} className="iso-line wavebox-helix" data-tone="mid" data-free d={INITIAL.helixD} />
        <path ref={dropWall} className="iso-line" data-tone="lo" data-dashed d="" />
        <path ref={dropFloor} className="iso-line" data-tone="lo" data-dashed d="" />
        <path ref={helix} className="iso-line wavebox-helix" data-tone="lit" data-free="start" d="" />
        <circle ref={point} className="wavebox-point" r={2} cx={0} cy={0} />
        {props.postFront}
        {props.rail}
        <g ref={sled} transform={shift(X0)}>
          {props.sled}
        </g>
        {props.controls}
        <path ref={omegaNeedle} className="iso-line" data-tone="hi" data-free="end" d={omegaPointer(OMEGA_DEFAULT)} style={{ strokeWidth: 1.1 }} />
        <path ref={gammaNeedle} className="iso-line" data-tone="hi" data-free="end" d={gammaPointer(GAMMA_DEFAULT)} style={{ strokeWidth: 1.1 }} />
        <g style={{ display: running ? "" : "none" }}>{props.runOn}</g>
        <g style={{ display: running ? "none" : "" }}>{props.runOff}</g>
        {props.dial}
        <text className="iso-face-text" data-tone="lo" transform={props.dialLabel} fontSize={2.4} textAnchor="middle">
          |f|
        </text>
        <path ref={needle} className="wavebox-needle" d={needleFrame(0)} />
      </IsoFigure>
    </div>
  );
}
