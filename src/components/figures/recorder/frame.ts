// Geometry that changes every frame: the disc tower, the link rod, the
// carriage position, the trace on the paper and the knob pointers.

import { cylinder, iso, lineOnTop, pathOf, ring, segment, type Flat, type Plane, type SolidPaths } from "@/components/iso/iso-kit";
import { knobPointer } from "../shared/parts";
import { chainAt, evalSeries, type Preset } from "./model";
import {
  CARRIAGE,
  DISC_H,
  DISC_MAX,
  DISC_MIN_R,
  HOLDER_H,
  LINK_Z,
  P,
  PAPER_TOP,
  PEN_X,
  SEL_H,
  SEL_KNOB,
  SEL_R,
  SPINDLE_Z,
  SX,
  TERMS_H,
  TERMS_KNOB,
  TERMS_R,
  TOWER,
} from "./view";

export interface DiscFrame {
  shown: boolean;
  disc: SolidPaths | null;
  spoke: string;
  hub: string;
  pivot: string;
}

export interface TowerFrame {
  discs: DiscFrame[];
  holder: SolidPaths;
  arm: string;
  pin: string;
  link: string;
  penY: number;
}

const EMPTY: DiscFrame = { shown: false, disc: null, spoke: "", hub: "", pivot: "" };

/** Wave coordinates to the tower's plane: x along world x, wave y toward −y (so up on the page is away). */
const onTower = (x: number, y: number): Plane => [TOWER[0] + x, TOWER[1] - y];

export function towerFrame(preset: Preset, count: number, x: number, scale: number): TowerFrame {
  const { links, tip } = chainAt(x, preset.terms, count);
  const frames: DiscFrame[] = [];
  let z = SPINDLE_Z;
  let last: Plane = onTower(0, 0);
  let lastTop = z;
  for (let j = 0; j < DISC_MAX; j++) {
    const l = links[j];
    const r = l ? l.r * scale : 0;
    if (!l || r < DISC_MIN_R) {
      frames.push(EMPTY);
      continue;
    }
    const c = onTower(l.cx * scale, l.cy * scale);
    const p = onTower(l.tx * scale, l.ty * scale);
    const top = z + DISC_H;
    frames.push({
      shown: true,
      disc: cylinder(c[0], c[1], r, z, DISC_H, P, r > 16 ? 36 : r > 6 ? 24 : 14),
      spoke: lineOnTop(c, p, top + 0.1, P),
      hub: ring(c[0], c[1], 0.8, top + 0.1, P, 10),
      pivot: ring(p[0], p[1], 0.8, top + 0.1, P, 10),
    });
    last = p;
    lastTop = top;
    z = top;
  }
  const tipWorld = onTower(tip[0] * scale, tip[1] * scale);
  const pinZ = lastTop + HOLDER_H;
  const penY = -tip[1] * scale;
  return {
    discs: frames,
    holder: cylinder(last[0], last[1], 1.1, lastTop, HOLDER_H, P, 12),
    arm: lineOnTop(last, tipWorld, pinZ + 0.1, P),
    pin: ring(tipWorld[0], tipWorld[1], 0.9, pinZ + 0.1, P, 10),
    link: segment([tipWorld[0], tipWorld[1], pinZ + 0.1], [PEN_X, CARRIAGE.y - 1.2 + penY, LINK_Z + 0.8], P),
    penY,
  };
}

/** Screen points of the whole wave in paper-fixed coordinates (x = 0 under the pen when the paper is at rest). */
export function traceScreen(preset: Preset, count: number, scale: number, samples = 900): Flat[] {
  const out: Flat[] = new Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = (i / (samples - 1)) * preset.xMax;
    out[i] = iso([PEN_X + x * SX, -evalSeries(x, preset.terms, count) * scale, PAPER_TOP + 0.1], P);
  }
  return out;
}

export function tracePath(points: Flat[], u: number, penScreen: Flat): string {
  const n = points.length - 1;
  const upto = Math.max(0, Math.min(n, Math.floor(u * n)));
  const slice = points.slice(0, upto + 1);
  slice.push(penScreen);
  return pathOf(slice);
}

/** Where the pen tip is on the (scrolled) paper: in paper-fixed coordinates it sits at x·SX along the paper. */
export const penOnPaper = (x: number, y: number, scale: number): Flat => iso([PEN_X + x * SX, -y * scale, PAPER_TOP + 0.1], P);

const KNOB_FROM = -Math.PI * 0.75;
const KNOB_SPAN = Math.PI * 1.5;

export const selPointer = (index: number, total: number) => knobPointer(P, SEL_KNOB[0], SEL_KNOB[1], SEL_R, SEL_H, KNOB_FROM + (index / Math.max(1, total - 1)) * KNOB_SPAN);
export const termsPointer = (count: number, max: number) => knobPointer(P, TERMS_KNOB[0], TERMS_KNOB[1], TERMS_R, TERMS_H, KNOB_FROM + ((count - 1) / (max - 1)) * KNOB_SPAN);
