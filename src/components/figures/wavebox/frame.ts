// Geometry that changes: the helix and its three projections (rebuilt when a
// knob moves), and per frame the drawn prefixes, the point, its drop lines,
// the sled, the knob pointers and the needle.

import { iso, pathOf, segment, type Flat, type Point3 } from "@/components/iso/iso-kit";
import { knobPointer, needleAt } from "../shared/parts";
import { GAMMA_RANGE, OMEGA_RANGE, SAMPLES, T_MAX, evalWave, sampleWave } from "./model";
import { DIAL, DIAL_R, DIAL_TOP, FLOOR_TOP, GAMMA_KNOB, KNOB_H, KNOB_R, OMEGA_KNOB, P, PANEL_FACE, R, RAIL_Y, ROD_Z, WALL_FACE, tToX } from "./view";

export interface Curves {
  helix: Flat[];
  floor: Flat[];
  wall: Flat[];
  panel: Flat[];
  helixD: string;
  floorD: string;
  wallD: string;
  panelD: string;
}

const helixPoint = (t: number, re: number, im: number): Point3 => [tToX(t), re * R, ROD_Z + im * R];

export function curvesOf(omega: number, gamma: number): Curves {
  const samples = sampleWave(omega, gamma, SAMPLES);
  const helix = samples.map(({ t, re, im }) => iso(helixPoint(t, re, im), P));
  const floor = samples.map(({ t, re }) => iso([tToX(t), re * R, FLOOR_TOP + 0.1], P));
  const wall = samples.map(({ t, im }) => iso([tToX(t), WALL_FACE + 0.1, ROD_Z + im * R], P));
  const panel = samples.map(({ re, im }) => iso([PANEL_FACE + 0.1, re * R, ROD_Z + im * R], P));
  return { helix, floor, wall, panel, helixD: pathOf(helix), floorD: pathOf(floor), wallD: pathOf(wall), panelD: pathOf(panel) };
}

export interface Moment {
  helix: string;
  floor: string;
  wall: string;
  panel: string;
  point: Flat;
  floorDot: Flat;
  wallDot: Flat;
  panelDot: Flat;
  dropFloor: string;
  dropWall: string;
  sledLine: string;
  sled: number;
}

const prefix = (points: Flat[], u: number, end: Flat) => {
  const n = points.length - 1;
  const upto = Math.max(0, Math.min(n, Math.floor(u * n)));
  const slice = points.slice(0, upto + 1);
  slice.push(end);
  return pathOf(slice);
};

export function momentOf(curves: Curves, t: number, omega: number, gamma: number): Moment {
  const { re, im } = evalWave(t, omega, gamma);
  const u = t / T_MAX;
  const x = tToX(t);
  const p = helixPoint(t, re, im);
  const point = iso(p, P);
  const floorAt: Point3 = [x, re * R, FLOOR_TOP + 0.1];
  const wallAt: Point3 = [x, WALL_FACE + 0.1, ROD_Z + im * R];
  const panelAt: Point3 = [PANEL_FACE + 0.1, re * R, ROD_Z + im * R];
  return {
    helix: prefix(curves.helix, u, point),
    floor: prefix(curves.floor, u, iso(floorAt, P)),
    wall: prefix(curves.wall, u, iso(wallAt, P)),
    panel: prefix(curves.panel, u, iso(panelAt, P)),
    point,
    floorDot: iso(floorAt, P),
    wallDot: iso(wallAt, P),
    panelDot: iso(panelAt, P),
    dropFloor: segment(p, floorAt, P),
    dropWall: segment(p, wallAt, P),
    sledLine: segment([x, RAIL_Y - 5, FLOOR_TOP + 0.1], [x, re * R, FLOOR_TOP + 0.1], P),
    sled: x,
  };
}

const KNOB_FROM = -Math.PI * 0.75;
const KNOB_SPAN = Math.PI * 1.5;
const share = (v: number, [lo, hi]: [number, number]) => (v - lo) / (hi - lo);

export const omegaPointer = (omega: number) => knobPointer(P, OMEGA_KNOB[0], OMEGA_KNOB[1], KNOB_R, KNOB_H, KNOB_FROM + share(omega, OMEGA_RANGE) * KNOB_SPAN);
export const gammaPointer = (gamma: number) => knobPointer(P, GAMMA_KNOB[0], GAMMA_KNOB[1], KNOB_R, KNOB_H, KNOB_FROM + share(gamma, GAMMA_RANGE) * KNOB_SPAN);
export const needleFrame = (magnitude: number) => needleAt(P, DIAL[0], DIAL[1], DIAL_R, DIAL_TOP, Math.min(0.98, magnitude * 0.9));
