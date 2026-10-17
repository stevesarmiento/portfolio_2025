// Every static part of the plotter, computed once at module load.

import { cylinder, insetPlan, iso, planOutline, sideSeam, slabOf, topMatrix, knurl, ring, type Plan } from "@/components/iso/iso-kit";
import { basePlate, dialGauge, join, knob, labelPlate, rulerStrip, toggle } from "../shared/parts";
import {
  BASE,
  BASE_H,
  CARD,
  CARD_H,
  COUNTER,
  COUNTER_H,
  CRANK,
  CRANK_R,
  DIAL,
  DIAL_H,
  DIAL_R,
  DIAL_STAND,
  DIAL_STAND_H,
  FOOT_H,
  LABEL,
  MAG,
  MAG_FENCE_H,
  MAG_STACK,
  MAG_STACK_H,
  MAG_STACK_Z,
  N_KNOB,
  N_KNOB_H,
  N_KNOB_R,
  P,
  RULER,
  TOGGLE_AUTO,
  TOGGLE_RUN,
  TRAY,
  TRAY_WALL_H,
} from "./view";

export const BASE_ART = basePlate(P, BASE, BASE_H, FOOT_H);
export const LABEL_ART = labelPlate(P, LABEL);
export const RULER_ART = rulerStrip(P, RULER);

// The bed: a faint recess outline, four registration pins and two clips.
const PIN_R = 1.3;
const PINS = [
  [CARD.x - 3, CARD.y - 3],
  [CARD.x + CARD.w + 3, CARD.y - 3],
  [CARD.x - 3, CARD.y + CARD.d + 3],
  [CARD.x + CARD.w + 3, CARD.y + CARD.d + 3],
] as const;
const CLIP_A: Plan = { x: CARD.x - 4, y: CARD.y + 18, w: 10, d: 12, r: 1.2 };
const CLIP_B: Plan = { x: CARD.x + CARD.w - 6, y: CARD.y + CARD.d - 30, w: 10, d: 12, r: 1.2 };

export const BED_ART = {
  recess: planOutline(insetPlan(CARD, -2.2), 0, P),
  pins: PINS.map(([x, y]) => cylinder(x, y, PIN_R, 0, 2.4, P, 14)),
  pinTops: PINS.map(([x, y]) => iso([x, y, 2.4], P)),
  card: slabOf(CARD, 0, CARD_H, P, 3),
  clips: [CLIP_A, CLIP_B].map((plan) => slabOf(plan, 0, 2.4, P, 3, 0.3)),
  clipScrews: [CLIP_A, CLIP_B].map((plan) => iso([plan.x + plan.w / 2, plan.y + plan.d / 2, 2.4], P)),
};

// Card magazine: a tray, the stack of 94 cards, a back fence and a side fence, a feed lever.
const FENCE_BACK: Plan = { x: MAG.x, y: MAG.y, w: MAG.w, d: 3, r: 0.8 };
const FENCE_SIDE: Plan = { x: MAG.x, y: MAG.y, w: 3, d: MAG.d, r: 0.8 };
const LEVER_AT = [MAG.x + MAG.w + 7, MAG.y + 10] as const;
const stackSeams = join([2, 4, 6, 8, 10, 12].map((dz) => sideSeam(MAG_STACK, MAG_STACK_Z + dz, P, 3)));

export const MAG_ART = {
  tray: slabOf(MAG, 0, 2, P, 4, 0.4),
  slot: planOutline({ x: MAG.x + 6, y: MAG.y + MAG.d - 3.2, w: MAG.w - 12, d: 1.6, r: 0.8 }, 2, P, 3),
  stack: slabOf(MAG_STACK, MAG_STACK_Z, MAG_STACK_H, P, 3),
  stackSeams,
  fenceBack: slabOf(FENCE_BACK, 0, MAG_FENCE_H, P, 3, 0.4),
  fenceSide: slabOf(FENCE_SIDE, 0, MAG_FENCE_H - 6, P, 3, 0.4),
  fenceScrews: [
    iso([MAG.x + 6, MAG.y + 1.5, MAG_FENCE_H], P),
    iso([MAG.x + MAG.w - 6, MAG.y + 1.5, MAG_FENCE_H], P),
    iso([MAG.x + 1.5, MAG.y + MAG.d - 6, MAG_FENCE_H - 6], P),
  ],
  leverPost: cylinder(LEVER_AT[0], LEVER_AT[1], 2.2, 0, 11, P, 20),
  leverKnob: cylinder(LEVER_AT[0], LEVER_AT[1], 3.6, 11, 3.2, P, 24, 0.3),
  leverKnurl: knurl(LEVER_AT[0], LEVER_AT[1], 3.6, 11, 14.2, 18, P),
  leverHub: ring(LEVER_AT[0], LEVER_AT[1], 1.1, 14.2, P, 12),
};

// Output tray: a floor, four walls (front one lower) and a few finished cards.
const TRAY_CARDS = insetPlan(TRAY, 6);
export const TRAY_ART = {
  floor: slabOf(TRAY, 0, 1.2, P, 4),
  back: slabOf({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: 2.2, r: 0.6 }, 1.2, TRAY_WALL_H, P, 3, 0.3),
  left: slabOf({ x: TRAY.x, y: TRAY.y, w: 2.2, d: TRAY.d, r: 0.6 }, 1.2, TRAY_WALL_H, P, 3, 0.3),
  cards: slabOf(TRAY_CARDS, 1.2, 1.6, P, 3),
  cardSeam: sideSeam(TRAY_CARDS, 2, P, 3),
  right: slabOf({ x: TRAY.x + TRAY.w - 2.2, y: TRAY.y, w: 2.2, d: TRAY.d, r: 0.6 }, 1.2, TRAY_WALL_H, P, 3, 0.3),
  front: slabOf({ x: TRAY.x, y: TRAY.y + TRAY.d - 2.2, w: TRAY.w, d: 2.2, r: 0.6 }, 1.2, TRAY_WALL_H - 1.6, P, 3, 0.3),
  screws: [iso([TRAY.x + 1.1, TRAY.y + 6, 1.2 + TRAY_WALL_H], P), iso([TRAY.x + 1.1, TRAY.y + TRAY.d - 6, 1.2 + TRAY_WALL_H], P)],
};

// Controls: the N knob with its arc of ticks, the crank hub, two toggles, the counter.
export const N_KNOB_ART = knob(P, N_KNOB[0], N_KNOB[1], N_KNOB_R, 0, N_KNOB_H, { count: 28, every: 4, from: -Math.PI * 0.75, span: Math.PI * 1.5 });
export const CRANK_ART = {
  boss: cylinder(CRANK[0], CRANK[1], CRANK_R + 2.6, 0, 1.2, P, 28),
  hub: cylinder(CRANK[0], CRANK[1], CRANK_R, 1.2, 2.4, P, 24),
  bossScrews: [iso([CRANK[0] - CRANK_R - 1.4, CRANK[1], 1.2], P), iso([CRANK[0] + CRANK_R + 1.4, CRANK[1], 1.2], P)],
};
export const TOGGLE_AUTO_ART = toggle(P, TOGGLE_AUTO[0], TOGGLE_AUTO[1], 0);
export const TOGGLE_RUN_ART = toggle(P, TOGGLE_RUN[0], TOGGLE_RUN[1], 0);
const COUNTER_WINDOW = insetPlan(COUNTER, 2.4);
export const COUNTER_ART = {
  housing: slabOf(COUNTER, 0, COUNTER_H, P, 3, 0.4),
  window: slabOf(COUNTER_WINDOW, COUNTER_H - 0.6, 0.6, P, 3),
  windowLine: planOutline(COUNTER_WINDOW, COUNTER_H, P, 3),
  screws: [iso([COUNTER.x + 1.4, COUNTER.y + COUNTER.d / 2, COUNTER_H], P), iso([COUNTER.x + COUNTER.w - 1.4, COUNTER.y + COUNTER.d / 2, COUNTER_H], P)],
  text: topMatrix([COUNTER.x + COUNTER.w / 2, COUNTER.y + COUNTER.d / 2 + 1.2], COUNTER_H + 0.1, P, "x"),
};

// Dial gauge on a stand at the front-right.
export const DIAL_ART = {
  stand: slabOf(DIAL_STAND, 0, DIAL_STAND_H, P, 4, 0.5),
  standScrews: [
    iso([DIAL_STAND.x + 3, DIAL_STAND.y + 3, DIAL_STAND_H], P),
    iso([DIAL_STAND.x + DIAL_STAND.w - 3, DIAL_STAND.y + DIAL_STAND.d - 3, DIAL_STAND_H], P),
  ],
  ...dialGauge(P, DIAL[0], DIAL[1], DIAL_R, DIAL_STAND_H, DIAL_H),
};
