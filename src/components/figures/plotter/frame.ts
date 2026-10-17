// Geometry that changes every frame: the disc towers and their pens, the
// traces, the needle, the N knob pointer and the crank arm.

import { cylinder, extrude, iso, lineOnTop, pathOf, ring, segment, type Flat, type Plane, type SolidPaths } from "@/components/iso/iso-kit";
import { knobPointer, needleAt } from "../shared/parts";
import { chainAt, reconOf, type TowerModel } from "./model";
import {
  CARD_TOP,
  CRANK,
  CRANK_ARM,
  DIAL,
  DIAL_R,
  DIAL_SPAN,
  DIAL_TOP,
  DISC_H,
  DISC_MAX,
  DISC_MIN_R,
  HOLDER_H,
  ICON_SCALE,
  N_KNOB,
  N_KNOB_H,
  N_KNOB_R,
  P,
  SPINDLE_BASE,
  toWorld,
} from "./view";

export interface DiscFrame {
  shown: boolean;
  disc: SolidPaths | null;
  spoke: string;
  hub: string;
  pivot: string;
}

export interface TowerFrame {
  collar: SolidPaths;
  discs: DiscFrame[];
  holder: SolidPaths;
  arm: string;
  pen: string;
  penDot: Flat;
  tipWorld: Plane;
}

const EMPTY: DiscFrame = { shown: false, disc: null, spoke: "", hub: "", pivot: "" };

/** The tower for one contour at loop time t with `count` circles. */
export function towerFrame(tower: TowerModel, count: number, t: number): TowerFrame {
  const { discs, tip } = chainAt(tower, count, t);
  const origin = toWorld(tower.c0.re, tower.c0.im);
  const frames: DiscFrame[] = [];
  let z = CARD_TOP + SPINDLE_BASE;
  let last: Plane = origin;
  let lastTop = z;
  for (let j = 0; j < DISC_MAX; j++) {
    const d = discs[j];
    if (!d || d.r * ICON_SCALE < DISC_MIN_R) {
      frames.push(EMPTY);
      continue;
    }
    const c = toWorld(d.cx, d.cy);
    const p = toWorld(d.tx, d.ty);
    const r = d.r * ICON_SCALE;
    const top = z + DISC_H;
    frames.push({
      shown: true,
      disc: cylinder(c[0], c[1], r, z, DISC_H, P, r > 24 ? 40 : r > 8 ? 26 : 16),
      spoke: lineOnTop(c, p, top + 0.1, P),
      hub: ring(c[0], c[1], 0.8, top + 0.1, P, 10),
      pivot: ring(p[0], p[1], 0.8, top + 0.1, P, 10),
    });
    last = p;
    lastTop = top;
    z = top;
  }
  const pen = toWorld(tip[0], tip[1]);
  const armZ = lastTop + HOLDER_H;
  return {
    collar: cylinder(origin[0], origin[1], 2.4, CARD_TOP, SPINDLE_BASE, P, 16),
    discs: frames,
    holder: cylinder(last[0], last[1], 1.1, lastTop, HOLDER_H, P, 12),
    arm: lineOnTop(last, pen, armZ + 0.1, P),
    pen: segment([pen[0], pen[1], armZ + 0.1], [pen[0], pen[1], CARD_TOP], P),
    penDot: iso([pen[0], pen[1], CARD_TOP], P),
    tipWorld: pen,
  };
}

/** Screen points of the full curve a tower draws with `count` circles. */
export function traceScreen(tower: TowerModel, count: number): Flat[] {
  return reconOf(tower, count).map(([x, y]) => {
    const w = toWorld(x, y);
    return iso([w[0], w[1], CARD_TOP + 0.08], P);
  });
}

/** The part of a trace drawn so far: the samples up to u ∈ [0, 1] plus the pen's exact position. */
export function tracePath(points: Flat[], u: number, pen: Flat): string {
  const n = points.length - 1;
  const upto = Math.max(0, Math.min(n, Math.floor(u * n)));
  const slice = points.slice(0, upto + 1);
  slice.push(pen);
  return pathOf(slice);
}

export const needleFrame = (errorPct: number) => needleAt(P, DIAL[0], DIAL[1], DIAL_R, DIAL_TOP, Math.min(0.98, errorPct / DIAL_SPAN));

const KNOB_FROM = -Math.PI * 0.75;
const KNOB_SPAN = Math.PI * 1.5;

export const knobAngleOf = (count: number) => KNOB_FROM + (Math.log2(Math.max(1, count)) / 7) * KNOB_SPAN;

export const knobPointerFrame = (count: number) => knobPointer(P, N_KNOB[0], N_KNOB[1], N_KNOB_R, N_KNOB_H, knobAngleOf(count));

/** The crank arm and its handle at a given angle (radians, 0 along +x). */
export function crankFrame(angle: number): { arm: SolidPaths; handle: SolidPaths } {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const w = 2.2;
  const corners: Plane[] = [
    [CRANK[0] - uy * w, CRANK[1] + ux * w],
    [CRANK[0] + ux * CRANK_ARM - uy * w, CRANK[1] + uy * CRANK_ARM + ux * w],
    [CRANK[0] + ux * CRANK_ARM + uy * w, CRANK[1] + uy * CRANK_ARM - ux * w],
    [CRANK[0] + uy * w, CRANK[1] - ux * w],
  ];
  const end: Plane = [CRANK[0] + ux * CRANK_ARM, CRANK[1] + uy * CRANK_ARM];
  return {
    arm: extrude(corners, 3.6, 1.4, P, { convex: true, bevel: 0.3 }),
    handle: cylinder(end[0], end[1], 1.5, 5, 3.2, P, 14, 0.3),
  };
}
