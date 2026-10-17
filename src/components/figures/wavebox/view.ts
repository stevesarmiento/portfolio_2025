// World layout of the wave box and its camera. The t axis runs along x,
// the real part toward the viewer (+y), the imaginary part up (+z).

import { boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from "@/components/iso/iso-kit";
import { T_MAX } from "./model";

export const WIDTH = 600;
export const HEIGHT = 380;
export const AZIMUTH = 40;
export const ELEVATION = 30;

export const BASE: Plan = { x: -150, y: -72, w: 300, d: 144, r: 8 };
export const BASE_H = 10;
export const FOOT_H = 5;

// The rod (t axis) between two posts.
export const X0 = -98;
export const X1 = 100;
export const ROD_Z = 44;
export const ROD_R = 1.6;
export const POST_SIZE = 10;
export const POST_XS = [X0 - 10, X1 + 10];
/** Unit amplitude of the packet in world units. */
export const R = 26;

export const tToX = (t: number) => X0 + (t / T_MAX) * (X1 - X0);
export const xToT = (x: number) => ((x - X0) / (X1 - X0)) * T_MAX;

// Back wall (imaginary projection) and floor panel (real projection).
export const WALL_Y = -46;
export const WALL_D = 2.5;
export const WALL_FACE = WALL_Y + WALL_D;
export const WALL: Plan = { x: X0 - 6, y: WALL_Y, w: X1 - X0 + 12, d: WALL_D, r: 0.8 };
export const WALL_H = ROD_Z + R + 10;
export const FLOOR: Plan = { x: X0 - 6, y: -R - 6, w: X1 - X0 + 12, d: R * 2 + 12, r: 1.2 };
export const FLOOR_H = 0.5;
export const FLOOR_TOP = FLOOR_H;

// Left end panel: the complex plane seen head-on.
export const PANEL_X = X0 - 24;
export const PANEL_D = 2.5;
export const PANEL_FACE = PANEL_X + PANEL_D;
export const PANEL: Plan = { x: PANEL_X, y: -R - 9, w: PANEL_D, d: R * 2 + 18, r: 0.8 };
export const PANEL_Z0 = ROD_Z - R - 9;
export const PANEL_H = R * 2 + 18;

// Sled rail along the front.
export const RAIL_Y = R + 16;
export const RAIL: Plan = { x: X0 - 8, y: RAIL_Y - 3, w: X1 - X0 + 16, d: 6, r: 1 };
export const RAIL_H = 3;
export const SLED: Plan = { x: -5, y: RAIL_Y - 5, w: 10, d: 10, r: 1.5 };
export const SLED_Z = RAIL_H;
export const SLED_H = 5;
export const SLED_TOP = SLED_Z + SLED_H;

// Controls along the front edge and the dial at the right.
export const CTRL_Y = 60;
export const OMEGA_KNOB: Flat = [-122, CTRL_Y];
export const GAMMA_KNOB: Flat = [-92, CTRL_Y];
export const KNOB_R = 7;
export const KNOB_H = 5;
export const RUN_TOGGLE: Flat = [-64, CTRL_Y];
export const DIAL: Flat = [126, 50];
export const DIAL_R = 12;
export const DIAL_Z = 0;
export const DIAL_H = 8;
export const DIAL_TOP = DIAL_Z + DIAL_H;

export const LABEL: Plan = { x: 110, y: -68, w: 36, d: 9, r: 1.5 };
export const RULER: Plan = { x: -138, y: 65, w: 276, d: 4.5, r: 0.8 };

export const P = fitProjection([...boxCorners(BASE, -BASE_H - FOOT_H, 0), ...boxCorners(WALL, 0, WALL_H), ...boxCorners(PANEL, PANEL_Z0, PANEL_Z0 + PANEL_H)], WIDTH, HEIGHT, {
  pad: 28,
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
