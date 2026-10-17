// Parts shared by the lab instruments: the base plate on feet, ruler strips,
// label plates, knurled knobs, toggle switches and a face-up dial gauge.
// Every function takes the figure's projection so the parts shade correctly.

import {
  corners,
  cylinder,
  depthOf,
  haloOf,
  insetPlan,
  iso,
  knurl,
  lineOnTop,
  onTop,
  pathOf,
  planOutline,
  radialTicks,
  ring,
  sideArc,
  slabOf,
  topMatrix,
  topTicks,
  type Flat,
  type Plan,
  type Plane,
  type Projection,
  type SolidPaths,
} from "@/components/iso/iso-kit";

export const join = (paths: string[]) => paths.filter(Boolean).join("");

export const byDepth = (P: Projection) => (points: Plane[]) =>
  [...points].sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P));

/** Angle convention shared with radialTicks: 0 points to −y, clockwise seen from above. */
export const dialPoint = (cx: number, cy: number, radius: number, angle: number): Plane => [
  cx + Math.sin(angle) * radius,
  cy - Math.cos(angle) * radius,
];

export interface BasePlateArt {
  halo: string;
  feet: SolidPaths[][];
  slab: SolidPaths;
  groove: string;
  screwRings: string;
  screws: Flat[];
}

export function basePlate(P: Projection, plan: Plan, h = 10, footH = 5, bevel = 1.6): BasePlateArt {
  const z0 = -h - footH;
  const feet = byDepth(P)(corners(plan, 18));
  const screws = corners(plan, 8);
  return {
    halo: haloOf(plan, z0, h, P),
    feet: feet.map(([x, y]) => [cylinder(x, y, 7, z0, 1.6, P, 28), cylinder(x, y, 5.4, z0 + 1.6, footH - 1.6, P, 28)]),
    slab: slabOf(plan, -h, h, P, 8, bevel),
    groove: planOutline(insetPlan(plan, 4.5), 0, P),
    screwRings: join(screws.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
    screws: screws.map(([x, y]) => iso([x, y, 0], P)),
  };
}

export interface LabelPlateArt {
  plate: SolidPaths;
  line: string;
  rule: string;
  screws: Flat[];
}

export function labelPlate(P: Projection, plan: Plan, z = 0): LabelPlateArt {
  const top = z + 0.8;
  const lengths = [plan.w - 16, plan.w - 26, plan.w - 20];
  return {
    plate: slabOf(plan, z, 0.8, P, 4),
    line: planOutline(insetPlan(plan, 1.6), top, P),
    rule: join(
      lengths.map((length, row) =>
        onTop(
          [
            [plan.x + 8, plan.y + 3.2 + row * 2.1],
            [plan.x + 8 + length, plan.y + 3.2 + row * 2.1],
          ],
          top,
          P,
        ),
      ),
    ),
    screws: [iso([plan.x + 3.5, plan.y + plan.d / 2, top], P), iso([plan.x + plan.w - 3.5, plan.y + plan.d / 2, top], P)],
  };
}

export interface RulerArt {
  strip: SolidPaths;
  minor: string;
  major: string;
  ends: Flat[];
}

export function rulerStrip(P: Projection, strip: Plan, z = 0, step = 4, every = 5): RulerArt {
  const top = z + 0.6;
  const ticks = topTicks(strip.x + 4, strip.x + strip.w - 4, step, every, strip.y + 0.8, top, [2, 3.6], P);
  return {
    strip: slabOf(strip, z, 0.6, P, 3),
    minor: ticks.minor,
    major: ticks.major,
    ends: [iso([strip.x + 2, strip.y + 0.8, top], P), iso([strip.x + strip.w - 2, strip.y + 0.8, top], P)],
  };
}

export interface KnobArt {
  body: SolidPaths;
  knurl: string;
  hub: string;
  /** Engraved circle the ticks are rooted on. */
  rim: string;
  minor: string;
  major: string;
}

/** A knurled knob with a tick ring around it on the surface it stands on. */
export function knob(P: Projection, cx: number, cy: number, r: number, z: number, h: number, ticks: { count: number; every: number; from: number; span: number }): KnobArt {
  const t = radialTicks(cx, cy, r + 3.4, ticks.count, ticks.every, z, [1.2, 2.4], P, ticks.from, ticks.span);
  return {
    body: cylinder(cx, cy, r, z, h, P, 32, 0.4),
    knurl: knurl(cx, cy, r, z, z + h, Math.round(r * 4.5), P),
    hub: ring(cx, cy, 1.3, z + h, P, 12),
    rim: ring(cx, cy, r + 3.4, z, P, 48),
    minor: t.minor,
    major: t.major,
  };
}

export const knobPointer = (P: Projection, cx: number, cy: number, r: number, top: number, angle: number) =>
  lineOnTop(dialPoint(cx, cy, 1.3, angle), dialPoint(cx, cy, r - 1.2, angle), top + 0.15, P);

export interface ToggleArt {
  base: SolidPaths;
  screws: Flat[];
  on: SolidPaths[];
  off: SolidPaths[];
}

/** A small toggle switch: a base plate and a lever that leans toward or away from the viewer. */
export function toggle(P: Projection, cx: number, cy: number, z: number): ToggleArt {
  const base: Plan = { x: cx - 4.5, y: cy - 3, w: 9, d: 6, r: 1 };
  const lever = (lean: number) => [cylinder(cx, cy + lean, 1, z + 1.6, 3.6, P, 12), cylinder(cx, cy + lean * 1.6, 1.8, z + 5.2, 1.4, P, 16)];
  return {
    base: slabOf(base, z, 1.6, P, 3, 0.3),
    screws: [iso([cx - 3, cy, z + 1.6], P), iso([cx + 3, cy, z + 1.6], P)],
    on: lever(-1.2),
    off: lever(1.2),
  };
}

export interface DialArt {
  puck: SolidPaths;
  band: string;
  seam: string;
  bezel: string;
  face: string;
  minor: string;
  major: string;
  hub: string;
  label: string;
  top: number;
}

/** A face-up dial gauge: puck, knurled bezel band, tick ring, hub and a label matrix. */
export function dialGauge(P: Projection, cx: number, cy: number, R: number, z: number, h: number, ticks = 50): DialArt {
  const top = z + h;
  const t = radialTicks(cx, cy, R - 3, ticks, 5, top, [1.3, 2.8], P);
  return {
    puck: cylinder(cx, cy, R, z, h, P, 64, 0.8),
    band: knurl(cx, cy, R, top - 3.4, top, 84, P, 0.3),
    seam: sideArc(cx, cy, R, top - 3.4, P, 40),
    bezel: ring(cx, cy, R - 2.2, top, P, 64),
    face: ring(cx, cy, R - 3, top, P, 64),
    minor: t.minor,
    major: t.major,
    hub: ring(cx, cy, 1.6, top, P, 16),
    label: topMatrix([cx, cy + R * 0.45], top, P, "x"),
    top,
  };
}

/** A filled needle polygon on the dial face, turn in revolutions from the zero mark. */
export function needleAt(P: Projection, cx: number, cy: number, R: number, top: number, turn: number) {
  const angle = turn * Math.PI * 2;
  const ux = Math.sin(angle);
  const uy = -Math.cos(angle);
  const point = (along: number, across: number): Flat => iso([cx + ux * along - uy * across, cy + uy * along + ux * across, top + 0.1], P);
  return pathOf([point(R - 3.4, 0), point(0, 0.75), point(-3, 0.35), point(-3, -0.35), point(0, -0.75)], true);
}

export interface PostArt {
  collar: SolidPaths;
  post: SolidPaths;
  seams: string;
}

/** A round post on a collar with two faint seam rings. */
export function post(P: Projection, cx: number, cy: number, z: number, h: number, r = 3.2): PostArt {
  return {
    collar: cylinder(cx, cy, r + 1.8, z, 3, P, 28),
    post: cylinder(cx, cy, r, z + 3, h - 3, P, 28),
    seams: join([sideArc(cx, cy, r, z + h * 0.4, P, 16), sideArc(cx, cy, r, z + h * 0.7, P, 16)]),
  };
}

/** Flat 2-D content placed on a horizontal face. */
export const faceMatrix = (P: Projection, at: Plane, z: number) => topMatrix(at, z, P, "x");
