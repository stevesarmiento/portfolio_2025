// Every static part of the recorder, computed once at module load.

import { cylinder, insetPlan, iso, onTop, pathOf, planOutline, ringOf, sideRing, sideTicks, slabOf, type Flat, type Plan, type Point3 } from "@/components/iso/iso-kit";
import { basePlate, join, knob, labelPlate, rulerStrip, toggle } from "../shared/parts";
import {
  BASE,
  BASE_H,
  BEAM,
  BEAM_H,
  CARRIAGE,
  CARRIAGE_H,
  CARRIAGE_Z,
  FOOT_H,
  LABEL,
  MOTOR,
  MOTOR_H,
  P,
  PAPER_D,
  PAPER_TOP,
  PAPER_Y0,
  PAPER_Z,
  PEDESTAL_H,
  PEDESTAL_R,
  PEN_X,
  PLATEN,
  POST_H,
  POST_SIZE,
  POST_Y,
  ROLLER_R,
  ROLLER_XS,
  RULER,
  RUN_TOGGLE,
  SEL_H,
  SEL_KNOB,
  SEL_R,
  SPOOL_R,
  SPOOL_XS,
  SPROCKET_GAP,
  SPROCKET_INSET,
  STRIP,
  TERMS_H,
  TERMS_KNOB,
  TERMS_R,
  TOWER,
} from "./view";

export const BASE_ART = basePlate(P, BASE, BASE_H, FOOT_H);
export const LABEL_ART = labelPlate(P, LABEL);
export const RULER_ART = rulerStrip(P, RULER);

// Rollers are pill-shaped bars along y with ring ends and sprocket studs.
const rollerPlan = (x: number): Plan => ({ x: x - ROLLER_R, y: PAPER_Y0 - 7, w: ROLLER_R * 2, d: PAPER_D + 14, r: ROLLER_R });
const BEARING = (x: number, y: number): Plan => ({ x: x - 5, y: y - 3, w: 10, d: 6, r: 1.2 });

export const PAPER_ART = {
  bearings: ROLLER_XS.flatMap((x) => [slabOf(BEARING(x, PAPER_Y0 - 9), 0, 4, P, 3, 0.4), slabOf(BEARING(x, PAPER_Y0 + PAPER_D + 9), 0, 4, P, 3, 0.4)]),
  bearingScrews: ROLLER_XS.flatMap((x) => [iso([x, PAPER_Y0 - 9, 4], P), iso([x, PAPER_Y0 + PAPER_D + 9, 4], P)]),
  rollers: ROLLER_XS.map((x) => slabOf(rollerPlan(x), 0, ROLLER_R * 2, P, 10, 1.8)),
  rollerEnds: join(ROLLER_XS.flatMap((x) => [sideRing([x, PAPER_Y0 + PAPER_D + 7, ROLLER_R], ROLLER_R - 1.2, "y", P, 20), sideRing([x, PAPER_Y0 + PAPER_D + 7, ROLLER_R], 1.2, "y", P, 10)])),
  platen: slabOf(PLATEN, 0, PAPER_Z, P, 4, 0.6),
  strip: slabOf(STRIP, PAPER_Z, 0.6, P, 1),
  /** The strip's top face as a screen path, for clipping the scrolling trace. */
  clip: onTop(ringOf(STRIP, 1), PAPER_TOP, P, true),
  edgeLines: join([
    onTop([[STRIP.x, PAPER_Y0 + SPROCKET_INSET + 2.4], [STRIP.x + STRIP.w, PAPER_Y0 + SPROCKET_INSET + 2.4]], PAPER_TOP, P),
    onTop([[STRIP.x, PAPER_Y0 + PAPER_D - SPROCKET_INSET - 2.4], [STRIP.x + STRIP.w, PAPER_Y0 + PAPER_D - SPROCKET_INSET - 2.4]], PAPER_TOP, P),
  ]),
};

/** Sprocket holes along both paper edges over a long stretch of paper, in paper-fixed coordinates. */
export function sprocketDots(fromX: number, toX: number): Flat[] {
  const dots: Flat[] = [];
  for (let x = Math.ceil(fromX / SPROCKET_GAP) * SPROCKET_GAP; x <= toX; x += SPROCKET_GAP) {
    dots.push(iso([x, PAPER_Y0 + SPROCKET_INSET, PAPER_TOP], P), iso([x, PAPER_Y0 + PAPER_D - SPROCKET_INSET, PAPER_TOP], P));
  }
  return dots;
}

// Supply and take-up spools, each on two bearing blocks, with the paper
// running as a sloped sheet from the spool's top down to the nearest roller.
const spoolPlan = (x: number): Plan => ({ x: x - SPOOL_R, y: PAPER_Y0 - 5, w: SPOOL_R * 2, d: PAPER_D + 10, r: SPOOL_R });
const sheet = (xSpool: number, xRoller: number) => {
  const pts: Point3[] = [
    [xSpool, PAPER_Y0, SPOOL_R * 2 + 0.2],
    [xRoller, PAPER_Y0, PAPER_TOP],
    [xRoller, PAPER_Y0 + PAPER_D, PAPER_TOP],
    [xSpool, PAPER_Y0 + PAPER_D, SPOOL_R * 2 + 0.2],
  ];
  return pathOf(pts.map((p) => iso(p, P)), true);
};
export const SPOOL_ART = {
  bearings: SPOOL_XS.flatMap((x) => [slabOf(BEARING(x, PAPER_Y0 - 9), 0, 5, P, 3, 0.4), slabOf(BEARING(x, PAPER_Y0 + PAPER_D + 9), 0, 5, P, 3, 0.4)]),
  spools: SPOOL_XS.map((x) => slabOf(spoolPlan(x), 0, SPOOL_R * 2, P, 10, 2.4)),
  ends: SPOOL_XS.map((x) => join([sideRing([x, PAPER_Y0 + PAPER_D + 5, SPOOL_R], SPOOL_R - 1.6, "y", P, 24), sideRing([x, PAPER_Y0 + PAPER_D + 5, SPOOL_R], 1.4, "y", P, 10)])),
  sheets: [sheet(SPOOL_XS[0], ROLLER_XS[0]), sheet(SPOOL_XS[1], ROLLER_XS[1])],
};

// Pen bridge: two posts, a beam with a scale on its front face, the carriage slot.
const POSTS: Plan[] = [-POST_Y, POST_Y].map((y) => ({ x: PEN_X - POST_SIZE / 2, y: y - POST_SIZE / 2, w: POST_SIZE, d: POST_SIZE, r: 1.5 }));
const BEAM_TOP = POST_H + BEAM_H;
const beamScale = sideTicks(-PAPER_D / 2, PAPER_D / 2, 5, 5, PEN_X + 4, BEAM_TOP - 0.8, [1.6, 3.2], P, "y");

export const BRIDGE_ART = {
  postFeet: POSTS.map((plan) => slabOf(insetPlan(plan, -2.5), 0, 1.6, P, 3, 0.3)),
  footScrews: POSTS.flatMap((plan) => [iso([plan.x - 1.2, plan.y + POST_SIZE / 2, 1.6], P), iso([plan.x + POST_SIZE + 1.2, plan.y + POST_SIZE / 2, 1.6], P)]),
  posts: POSTS.map((plan) => slabOf(plan, 1.6, POST_H - 1.6, P, 3, 0.4)),
  beam: slabOf(BEAM, POST_H, BEAM_H, P, 4, 0.6),
  beamScrews: POSTS.map((plan) => iso([PEN_X, plan.y + POST_SIZE / 2, BEAM_TOP], P)),
  scaleBase: onTop([[PEN_X + 4, -PAPER_D / 2], [PEN_X + 4, PAPER_D / 2]], BEAM_TOP - 0.8, P),
  scaleMinor: beamScale.minor,
  scaleMajor: beamScale.major,
  zero: onTop([[PEN_X + 4, 0], [PEN_X + 4, 0]], BEAM_TOP - 0.8, P),
  slot: planOutline({ x: PEN_X - 1.2, y: -PAPER_D / 2 - 2, w: 2.4, d: PAPER_D + 4, r: 1.2 }, POST_H, P, 3),
  // The carriage is built at y = 0 and moved along y each frame.
  carriage: slabOf(CARRIAGE, CARRIAGE_Z, CARRIAGE_H, P, 3, 0.5),
  carriageSeam: planOutline(insetPlan(CARRIAGE, 1.4), CARRIAGE_Z + CARRIAGE_H, P, 3),
  carriageScrews: [iso([CARRIAGE.x + 2, CARRIAGE.y + 2, CARRIAGE_Z + CARRIAGE_H], P), iso([CARRIAGE.x + CARRIAGE.w - 2, CARRIAGE.y + CARRIAGE.d - 2, CARRIAGE_Z + CARRIAGE_H], P)],
  penCollar: cylinder(PEN_X, 0, 2.2, CARRIAGE_Z - 3, 3, P, 16),
  penRod: cylinder(PEN_X, 0, 0.9, PAPER_TOP, CARRIAGE_Z - 3 - PAPER_TOP, P, 10),
  penTip: iso([PEN_X, 0, PAPER_TOP], P),
  linkPin: cylinder(PEN_X, CARRIAGE.y + CARRIAGE.d + 1.2, 1.2, CARRIAGE_Z + 0.6, 1.6, P, 10),
};

// Disc tower pedestal and the motor that drives its spindle.
const COUPLING: Plan = { x: TOWER[0] + PEDESTAL_R - 2, y: TOWER[1] - 3, w: MOTOR.x - (TOWER[0] + PEDESTAL_R) + 2, d: 6, r: 1.2 };
export const TOWER_ART = {
  pedestal: cylinder(TOWER[0], TOWER[1], PEDESTAL_R, 0, PEDESTAL_H, P, 40, 0.5),
  pedestalScrews: [0, 1, 2, 3].map((i) => {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    return iso([TOWER[0] + Math.cos(a) * (PEDESTAL_R - 2.4), TOWER[1] + Math.sin(a) * (PEDESTAL_R - 2.4), PEDESTAL_H], P);
  }),
  motor: slabOf(MOTOR, 0, MOTOR_H, P, 4, 0.8),
  motorVents: join([0, 1, 2].map((i) => planOutline({ x: MOTOR.x + 3, y: MOTOR.y + 3 + i * 3.4, w: MOTOR.w - 6, d: 1.4, r: 0.7 }, MOTOR_H, P, 3))),
  motorScrews: [iso([MOTOR.x + 2, MOTOR.y + 2, MOTOR_H], P), iso([MOTOR.x + MOTOR.w - 2, MOTOR.y + 2, MOTOR_H], P)],
  coupling: slabOf(COUPLING, 0, 2.4, P, 3, 0.4),
  cap: cylinder(MOTOR.x + MOTOR.w / 2, MOTOR.y + MOTOR.d / 2, 3.2, MOTOR_H, 1.6, P, 20),
};

export const SEL_ART = knob(P, SEL_KNOB[0], SEL_KNOB[1], SEL_R, 0, SEL_H, { count: 5, every: 1, from: -Math.PI * 0.75, span: Math.PI * 1.5 });
export const TERMS_ART = knob(P, TERMS_KNOB[0], TERMS_KNOB[1], TERMS_R, 0, TERMS_H, { count: 12, every: 4, from: -Math.PI * 0.75, span: Math.PI * 1.5 });
export const RUN_ART = toggle(P, RUN_TOGGLE[0], RUN_TOGGLE[1], 0);
