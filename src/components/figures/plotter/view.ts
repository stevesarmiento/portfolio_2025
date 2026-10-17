// World layout of the plotter and its camera. Units are about 1 px.

import { boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from "@/components/iso/iso-kit";

export const WIDTH = 600;
export const HEIGHT = 400;
export const AZIMUTH = 48;
export const ELEVATION = 32;

export const BASE: Plan = { x: -150, y: -90, w: 300, d: 180, r: 8 };
export const BASE_H = 10;
export const FOOT_H = 5;

// The paper card and the icon on it.
export const CARD: Plan = { x: -62, y: -62, w: 124, d: 124, r: 2 };
export const CARD_H = 0.8;
export const CARD_TOP = CARD_H;
export const CARD_C: Flat = [0, 0];
/** Normalized icon height (1) in world units. */
export const ICON_SCALE = 96;
/** Where a card waits before it slides onto the bed. */
export const CARD_FROM_X = -100;

// Disc towers.
export const SPINDLE_BASE = 1.6;
export const DISC_H = 1.5;
export const DISC_MAX = 6;
export const DISC_MIN_R = 1.1;
export const HOLDER_H = 2.2;

// Card magazine, back-left, and the output tray on the right.
export const MAG: Plan = { x: -142, y: -82, w: 54, d: 64, r: 2 };
export const MAG_STACK: Plan = { x: -138, y: -78, w: 46, d: 56, r: 1.5 };
export const MAG_STACK_Z = 2;
export const MAG_STACK_H = 14;
export const MAG_FENCE_H = 26;
export const TRAY: Plan = { x: 92, y: -64, w: 52, d: 104, r: 2 };
export const TRAY_WALL_H = 4;

// Controls along the front edge.
export const CTRL_Y = 73;
export const N_KNOB: Flat = [-118, CTRL_Y];
export const N_KNOB_R = 8;
export const N_KNOB_H = 6;
export const CRANK: Flat = [-80, CTRL_Y];
export const CRANK_R = 4;
export const CRANK_ARM = 9;
export const TOGGLE_AUTO: Flat = [-46, CTRL_Y];
export const TOGGLE_RUN: Flat = [-28, CTRL_Y];
export const COUNTER: Plan = { x: -8, y: CTRL_Y - 6, w: 38, d: 12, r: 1.5 };
export const COUNTER_H = 4;

export const DIAL: Flat = [122, 68];
export const DIAL_R = 13;
export const DIAL_STAND: Plan = { x: DIAL[0] - 11, y: DIAL[1] - 11, w: 22, d: 22, r: 3 };
export const DIAL_STAND_H = 5;
export const DIAL_H = 8;
export const DIAL_TOP = DIAL_STAND_H + DIAL_H;
/** Needle turns per percent of error; one full turn is 25 %. */
export const DIAL_SPAN = 25;

export const LABEL: Plan = { x: 96, y: -86, w: 48, d: 10, r: 1.5 };
export const RULER: Plan = { x: -138, y: 84, w: 276, d: 4.5, r: 0.8 };

export const P = fitProjection([...boxCorners(BASE, -BASE_H - FOOT_H, 0), ...boxCorners(MAG, 0, MAG_FENCE_H), [DIAL[0], DIAL[1], DIAL_TOP + 2]], WIDTH, HEIGHT, {
  pad: 30,
  azimuth: AZIMUTH,
  elevation: ELEVATION,
});

export const at = (point: Point3) => iso(point, P);

const ORIGIN = at([0, 0, 0]);
const minus = (a: Flat, b: Flat): Flat => [a[0] - b[0], a[1] - b[1]];
export const EX = minus(at([1, 0, 0]), ORIGIN);
export const EY = minus(at([0, 1, 0]), ORIGIN);
export const EZ = minus(at([0, 0, 1]), ORIGIN);

const fine = (value: number) => Math.round(value * 100) / 100;
export const shift = (x: number, y = 0, z = 0) => `translate(${fine(EX[0] * x + EY[0] * y + EZ[0] * z)} ${fine(EX[1] * x + EY[1] * y + EZ[1] * z)})`;

/** Normalized icon coordinates (y up) to world coordinates on the card. */
export const toWorld = (x: number, y: number): Flat => [CARD_C[0] + ICON_SCALE * x, CARD_C[1] - ICON_SCALE * y];

/** Screen position of a world point, for hit-testing controls. */
export const screenOf = (point: Point3) => at(point);
