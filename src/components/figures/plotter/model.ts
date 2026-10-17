// The plotter's truth: each contour of an icon is a Fourier series, drawn by
// a chain of circles. Pure module, reused from the earlier flat tracer.

import {
  dft,
  evalComplex,
  maxErrorPct,
  normalizeMany,
  polyLength,
  resampleClosed,
  type Coef,
  type Pt,
} from "@/components/playground/fourier-outline/outline-math";

export const TWO_PI = Math.PI * 2;
export const MAX_TERMS = 128;
export const GROW = [2, 8, 32, 128];
export const SAMPLES = 1024;
export const MIN_CONTOUR_SAMPLES = 32;

export interface TowerModel {
  pts: Pt[];
  circles: Coef[];
  c0: { re: number; im: number };
}

export interface IconModel {
  towers: TowerModel[];
  /** Bounding-box centre of the raw points (y up) and its height, for the silhouette. */
  center: Pt;
  height: number;
  width: number;
}

export function iconModel(contours: readonly (readonly Pt[])[], samples = SAMPLES): IconModel {
  const lengths = contours.map(polyLength);
  const total = lengths.reduce((a, b) => a + b, 0) || 1;
  const resampled = contours.map((c, i) => resampleClosed(c, Math.max(MIN_CONTOUR_SAMPLES, Math.round((samples * lengths[i]) / total))));
  const norm = normalizeMany(resampled);
  const towers = norm.contours.map((pts) => {
    const coefs = dft(pts);
    return {
      pts,
      circles: coefs.filter((c) => c.k !== 0),
      c0: coefs.find((c) => c.k === 0) ?? { re: 0, im: 0 },
    };
  });
  return { towers, center: norm.center, height: norm.height, width: norm.width };
}

export interface Disc {
  cx: number;
  cy: number;
  r: number;
  angle: number;
  tx: number;
  ty: number;
}

/** The chain at loop time t, in normalized units (y up), first circle at the centroid. */
export function chainAt(tower: TowerModel, count: number, t: number): { discs: Disc[]; tip: Pt } {
  const discs: Disc[] = [];
  let px = tower.c0.re;
  let py = tower.c0.im;
  const top = Math.min(count, tower.circles.length);
  for (let j = 0; j < top; j++) {
    const { k, amp, phase } = tower.circles[j];
    const angle = k * t + phase;
    const tx = px + amp * Math.cos(angle);
    const ty = py + amp * Math.sin(angle);
    discs.push({ cx: px, cy: py, r: amp, angle, tx, ty });
    px = tx;
    py = ty;
  }
  return { discs, tip: [px, py] };
}

/** The closed curve the pen draws with `count` circles, in normalized units. */
export function reconOf(tower: TowerModel, count: number): Pt[] {
  const n = tower.pts.length;
  const out: Pt[] = new Array(n + 1);
  for (let i = 0; i < n; i++) {
    const [x, y] = evalComplex(tower.circles, count, (TWO_PI * i) / n);
    out[i] = [x + tower.c0.re, y + tower.c0.im];
  }
  out[n] = out[0];
  return out;
}

export function errorOf(model: IconModel, count: number): number {
  let worst = 0;
  for (const tower of model.towers) {
    const recon = reconOf(tower, count);
    recon.pop();
    worst = Math.max(worst, maxErrorPct(tower.pts, recon));
  }
  return worst;
}

export function nextGrow(count: number): { next: number; wrapped: boolean } {
  const i = GROW.findIndex((n) => n > count);
  return i === -1 ? { next: GROW[0], wrapped: true } : { next: GROW[i], wrapped: false };
}

export const fmtError = (pct: number) => (pct >= 10 ? pct.toFixed(1) : pct >= 0.01 ? pct.toFixed(2) : "<0.01");

export const prettyName = (file: string) => file.replace(/\.svg$/i, "").replace(/[-_]+/g, " ");

export const readoutOf = (file: string, count: number, error: number) => `${prettyName(file)} · N ${count} · error ${fmtError(error)} %`;
