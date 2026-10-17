// World layout of the chart recorder and its camera.

import { boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from "@/components/iso/iso-kit";

export const WIDTH = 600;
export const HEIGHT = 380;
export const AZIMUTH = 52;
export const ELEVATION = 30;

export const BASE: Plan = { x: -150, y: -70, w: 300, d: 176, r: 8 };
export const BASE_H = 10;
export const FOOT_H = 5;

// Paper path: two rollers, a platen between them, the strip on top.
export const PAPER_Y0 = -35;
export const PAPER_D = 70;
export const STRIP_X0 = -70;
export const STRIP_X1 = 122;
// Paper supply and take-up spools beyond the rollers.
export const SPOOL_R = 8;
export const SPOOL_XS = [STRIP_X0 - 14, STRIP_X1 + 14];
export const ROLLER_R = 4.5;
export const ROLLER_XS = [STRIP_X0 + 2, STRIP_X1 - 2];
export const PAPER_Z = 2 * ROLLER_R - 0.6;
export const PAPER_TOP = PAPER_Z + 0.6;
export const PLATEN: Plan = { x: STRIP_X0 + 8, y: PAPER_Y0 - 2, w: STRIP_X1 - STRIP_X0 - 16, d: PAPER_D + 4, r: 1.5 };
export const STRIP: Plan = { x: STRIP_X0, y: PAPER_Y0, w: STRIP_X1 - STRIP_X0, d: PAPER_D, r: 0 };
export const SPROCKET_GAP = 6;
export const SPROCKET_INSET = 3;

// The pen writes at a fixed x; the paper scrolls under it toward −x.
export const PEN_X = 86;
/** Largest wave amplitude on paper, in world units. */
export const AMP = 24;
/** World units of paper per wave unit of x. */
export const SX = 18;

// Disc tower on a pedestal straight in front of the pen bridge, driven by a motor beside it.
export const TOWER: Flat = [86, 76];
export const PEDESTAL_R = 10;
export const PEDESTAL_H = 3;
export const SPINDLE_Z = PEDESTAL_H;
export const DISC_H = 1.4;
export const DISC_MAX = 13;
export const DISC_MIN_R = 0.9;
export const HOLDER_H = 2.2;
export const MOTOR: Plan = { x: TOWER[0] - 46, y: TOWER[1] - 8, w: 18, d: 16, r: 2 };
export const MOTOR_H = 12;

// Pen bridge across the paper at PEN_X.
export const POST_SIZE = 8;
export const POST_Y = PAPER_D / 2 + 10;
export const POST_H = 24;
export const BEAM: Plan = { x: PEN_X - 4, y: -POST_Y - 6, w: 8, d: POST_Y * 2 + 12, r: 1.5 };
export const BEAM_H = 6;
export const CARRIAGE: Plan = { x: PEN_X - 5, y: -5, w: 10, d: 10, r: 1.5 };
export const CARRIAGE_Z = 15;
export const CARRIAGE_H = POST_H - CARRIAGE_Z;
export const LINK_Z = CARRIAGE_Z + 1.2;

// Controls along the front edge.
export const CTRL_Y = 58;
export const SEL_KNOB: Flat = [-118, CTRL_Y];
export const SEL_R = 8;
export const SEL_H = 6;
export const TERMS_KNOB: Flat = [-86, CTRL_Y];
export const TERMS_R = 7;
export const TERMS_H = 5;
export const RUN_TOGGLE: Flat = [-58, CTRL_Y];

export const LABEL: Plan = { x: 96, y: -60, w: 48, d: 10, r: 1.5 };
export const RULER: Plan = { x: -138, y: -67.5, w: 276, d: 4.5, r: 0.8 };

export const P = fitProjection([...boxCorners(BASE, -BASE_H - FOOT_H, 0), ...boxCorners(BEAM, 0, POST_H + BEAM_H + 2), ...boxCorners(MOTOR, 0, MOTOR_H + 4)], WIDTH, HEIGHT, {
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
