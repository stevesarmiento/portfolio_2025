// Closed outlines for the Fourier tracer, as polylines in y-up coordinates.
// Pure module — no React, no DOM.

import type { Pt } from "./outline-math";

/**
 * Moore curve of the given order: a closed loop through every cell of a
 * 2^order × 2^order grid. L-system: axiom LFL+F+LFL, L → −RF+LFL+FR−,
 * R → +LF−RFR−FL+, turn 90°. The last cell is adjacent to the first, so the
 * polygon closes with one more unit step.
 */
export function mooreCurve(order: number): Pt[] {
  let s = "LFL+F+LFL";
  for (let i = 1; i < order; i++) {
    let next = "";
    for (const ch of s) {
      if (ch === "L") next += "-RF+LFL+FR-";
      else if (ch === "R") next += "+LF-RFR-FL+";
      else next += ch;
    }
    s = next;
  }
  const dirs: Pt[] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let x = 0;
  let y = 0;
  let d = 0;
  const pts: Pt[] = [[0, 0]];
  for (const ch of s) {
    if (ch === "F") {
      x += dirs[d][0];
      y += dirs[d][1];
      pts.push([x, y]);
    } else if (ch === "+") d = (d + 1) % 4;
    else if (ch === "-") d = (d + 3) % 4;
  }
  return pts;
}

/** Koch snowflake boundary after `order` subdivisions (3·4^order edges). */
export function kochSnowflake(order: number): Pt[] {
  const h = Math.sqrt(3) / 2;
  let pts: Pt[] = [
    [-0.5, -h / 3],
    [0.5, -h / 3],
    [0, (2 * h) / 3],
  ];
  for (let it = 0; it < order; it++) {
    const next: Pt[] = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[(i + 1) % pts.length];
      const dx = (bx - ax) / 3;
      const dy = (by - ay) / 3;
      const p1: Pt = [ax + dx, ay + dy];
      const p3: Pt = [ax + 2 * dx, ay + 2 * dy];
      // apex of the outward-pointing bump: rotate (p3 − p1) by −60° about p1
      const c = Math.cos(-Math.PI / 3);
      const s = Math.sin(-Math.PI / 3);
      const p2: Pt = [p1[0] + dx * c - dy * s, p1[1] + dx * s + dy * c];
      next.push([ax, ay], p1, p2, p3);
    }
    pts = next;
  }
  return pts;
}

/** A blocky summation sign, as one polygon. */
export const sigma: Pt[] = [
  [0, 1],
  [1, 1],
  [1, 0.8],
  [0.3, 0.8],
  [0.64, 0.5],
  [0.3, 0.2],
  [1, 0.2],
  [1, 0],
  [0, 0],
  [0, 0.12],
  [0.4, 0.5],
  [0, 0.88],
];

/** Five-pointed star, for a cheap shape with sharp corners. */
export function star(points = 5, inner = 0.42): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 1 : inner;
    const a = Math.PI / 2 + (i * Math.PI) / points;
    pts.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  return pts;
}
