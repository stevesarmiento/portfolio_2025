// Every static part of the wave box, computed once at module load.

import { cylinder, insetPlan, iso, onTop, pathOf, planOutline, segment, sideRing, slabOf, topTicks, type Flat, type Plan, type Point3 } from "@/components/iso/iso-kit";
import { basePlate, dialGauge, join, knob, labelPlate, rulerStrip, toggle } from "../shared/parts";
import { T0, T_MAX } from "./model";
import {
  BASE,
  BASE_H,
  DIAL,
  DIAL_H,
  DIAL_R,
  DIAL_Z,
  FLOOR,
  FLOOR_H,
  FLOOR_TOP,
  FOOT_H,
  GAMMA_KNOB,
  KNOB_H,
  KNOB_R,
  LABEL,
  OMEGA_KNOB,
  P,
  PANEL,
  PANEL_FACE,
  PANEL_H,
  PANEL_Z0,
  POST_SIZE,
  POST_XS,
  R,
  RAIL,
  RAIL_H,
  RAIL_Y,
  ROD_R,
  ROD_Z,
  RULER,
  RUN_TOGGLE,
  SLED,
  SLED_H,
  SLED_TOP,
  SLED_Z,
  WALL,
  WALL_FACE,
  WALL_H,
  X0,
  X1,
  tToX,
} from "./view";

export const BASE_ART = basePlate(P, BASE, BASE_H, FOOT_H);
export const LABEL_ART = labelPlate(P, LABEL);
export const RULER_ART = rulerStrip(P, RULER);

const POSTS: Plan[] = POST_XS.map((x) => ({ x: x - POST_SIZE / 2, y: -POST_SIZE / 2, w: POST_SIZE, d: POST_SIZE, r: 1.5 }));
const wallLine = (a: Point3, b: Point3) => segment(a, b, P);

// Back wall with a faint grid: verticals at each 0.5 t, horizontals at 0, ±1.
const T_MARKS = [0, 0.5, 1, 1.5, 2].filter((t) => t <= T_MAX);
export const WALL_ART = {
  wall: slabOf(WALL, 0, WALL_H, P, 3, 0.5),
  grid: join([
    ...T_MARKS.map((t) => wallLine([tToX(t), WALL_FACE, ROD_Z - R - 4], [tToX(t), WALL_FACE, ROD_Z + R + 4])),
    ...[-1, 0, 1].map((v) => wallLine([X0 - 2, WALL_FACE, ROD_Z + v * R], [X1 + 2, WALL_FACE, ROD_Z + v * R])),
  ]),
  frame: pathOf(
    [
      [X0 - 2, WALL_FACE, ROD_Z - R - 4],
      [X1 + 2, WALL_FACE, ROD_Z - R - 4],
      [X1 + 2, WALL_FACE, ROD_Z + R + 4],
      [X0 - 2, WALL_FACE, ROD_Z + R + 4],
    ].map((p) => iso(p as Point3, P)),
    true,
  ),
  t0: wallLine([tToX(T0), WALL_FACE, ROD_Z - R - 4], [tToX(T0), WALL_FACE, ROD_Z + R + 4]),
  screws: [iso([WALL.x + 4, WALL.y + WALL.d / 2, WALL_H], P), iso([WALL.x + WALL.w - 4, WALL.y + WALL.d / 2, WALL_H], P)],
};

// Floor panel with the same grid seen from above.
export const FLOOR_ART = {
  panel: slabOf(FLOOR, 0, FLOOR_H, P, 3),
  grid: join([
    ...T_MARKS.map((t) => onTop([[tToX(t), -R - 4], [tToX(t), R + 4]], FLOOR_TOP, P)),
    ...[-1, 0, 1].map((v) => onTop([[X0 - 2, v * R], [X1 + 2, v * R]], FLOOR_TOP, P)),
  ]),
  frame: planOutline({ x: X0 - 2, y: -R - 4, w: X1 - X0 + 4, d: R * 2 + 8, r: 0 }, FLOOR_TOP, P, 1),
  t0: onTop([[tToX(T0), -R - 4], [tToX(T0), R + 4]], FLOOR_TOP, P),
};

// Left end panel: the complex plane head-on, with a unit ring and axes.
const panelPoint = (re: number, im: number): Point3 => [PANEL_FACE, re * R, ROD_Z + im * R];
export const PANEL_ART = {
  panel: slabOf(PANEL, PANEL_Z0, PANEL_H, P, 3, 0.5),
  ring: sideRing([PANEL_FACE, 0, ROD_Z], R, "x", P, 48),
  halfRing: sideRing([PANEL_FACE, 0, ROD_Z], R / 2, "x", P, 32),
  axes: join([segment(panelPoint(-1.15, 0), panelPoint(1.15, 0), P), segment(panelPoint(0, -1.15), panelPoint(0, 1.15), P)]),
  axisEnds: [panelPoint(-1.15, 0), panelPoint(1.15, 0), panelPoint(0, -1.15), panelPoint(0, 1.15)].map((p) => iso(p, P)),
  screws: [iso([PANEL.x + PANEL.w / 2, PANEL.y + 3, PANEL_Z0 + PANEL_H], P), iso([PANEL.x + PANEL.w / 2, PANEL.y + PANEL.d - 3, PANEL_Z0 + PANEL_H], P)],
  feet: slabOf({ x: PANEL.x - 2, y: PANEL.y - 2, w: PANEL.w + 4, d: PANEL.d + 4, r: 1.2 }, 0, 2, P, 3, 0.3),
  stem: slabOf({ x: PANEL.x, y: -4, w: PANEL.w, d: 8, r: 0.8 }, 2, PANEL_Z0 - 2, P, 2),
};

// Posts carrying the rod, the rod itself, bores where it enters the posts.
export const ROD_ART = {
  postFeet: POSTS.map((plan) => slabOf(insetPlan(plan, -2.5), 0, 1.8, P, 3, 0.3)),
  posts: POSTS.map((plan) => slabOf(plan, 1.8, ROD_Z + 8 - 1.8, P, 3, 0.5)),
  caps: POSTS.map((plan) => slabOf(insetPlan(plan, -1), ROD_Z + 8, 1.6, P, 3, 0.4)),
  postScrews: POSTS.flatMap((plan) => [iso([plan.x + plan.w / 2, plan.y + plan.d / 2, ROD_Z + 9.6], P)]),
  rod: slabOf({ x: POST_XS[0], y: -ROD_R, w: POST_XS[1] - POST_XS[0], d: ROD_R * 2, r: ROD_R }, ROD_Z - ROD_R, ROD_R * 2, P, 6, 0.6),
  bores: join([sideRing([POST_XS[0] + POST_SIZE / 2, 0, ROD_Z], ROD_R + 0.8, "x", P, 16), sideRing([POST_XS[1] - POST_SIZE / 2, 0, ROD_Z], ROD_R + 0.8, "x", P, 16)]),
};

// Sled rail with end stops and a t ruler on top; the sled is built at x = 0.
const railTicks = topTicks(X0, X1, (X1 - X0) / T_MAX / 10, 5, RAIL_Y + 0.8, RAIL_H, [1.6, 3], P);
export const RAIL_ART = {
  rail: slabOf(RAIL, 0, RAIL_H, P, 3, 0.4),
  minor: railTicks.minor,
  major: railTicks.major,
  ruleBase: onTop([[X0, RAIL_Y + 0.8], [X1, RAIL_Y + 0.8]], RAIL_H, P),
  stops: [X0 - 4, X1 + 4].map((x) => slabOf({ x: x - 2, y: RAIL_Y - 4, w: 4, d: 8, r: 0.8 }, RAIL_H, 3, P, 3, 0.3)),
  stopScrews: [X0 - 4, X1 + 4].map((x) => iso([x, RAIL_Y, RAIL_H + 3], P)),
  sled: slabOf(SLED, SLED_Z, SLED_H, P, 3, 0.5),
  sledSeam: planOutline(insetPlan(SLED, 1.4), SLED_TOP, P, 3),
  sledScrews: [iso([SLED.x + 2, SLED.y + 2, SLED_TOP], P), iso([SLED.x + SLED.w - 2, SLED.y + 2, SLED_TOP], P)],
  index: segment([0, RAIL_Y + 0.8, SLED_TOP + 0.1], [0, RAIL_Y - 5, SLED_TOP + 0.1], P),
  mast: cylinder(0, RAIL_Y, 1.1, SLED_TOP, 10, P, 10),
  mastCap: cylinder(0, RAIL_Y, 1.8, SLED_TOP + 10, 1.4, P, 12),
};

export const OMEGA_ART = knob(P, OMEGA_KNOB[0], OMEGA_KNOB[1], KNOB_R, 0, KNOB_H, { count: 12, every: 4, from: -Math.PI * 0.75, span: Math.PI * 1.5 });
export const GAMMA_ART = knob(P, GAMMA_KNOB[0], GAMMA_KNOB[1], KNOB_R, 0, KNOB_H, { count: 12, every: 4, from: -Math.PI * 0.75, span: Math.PI * 1.5 });
export const RUN_ART = toggle(P, RUN_TOGGLE[0], RUN_TOGGLE[1], 0);
export const DIAL_ART = dialGauge(P, DIAL[0], DIAL[1], DIAL_R, DIAL_Z, DIAL_H, 40);

export type { Flat };
