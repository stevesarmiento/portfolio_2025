// Math + fixed oblique projection for the complex Gaussian wave packet:
//   f(t) = e^(−γ(t−t₀)²) · e^(iωt)
// Pure module — no React, no DOM (safe for SSR).

export const T_MAX = 2.44;
export const T0 = 1.22;
export const PLANE = 1.15; // half-extent of the projection planes in Re/Im units
export const LEFT_T = -0.5; // where the head-on complex-plane panel sits on the t axis
export const N_SAMPLES = 800;

export const VIEW_W = 640;
export const VIEW_H = 460;

// screen = ORIGIN + t·AX_T + re·AX_RE + im·AX_IM (SVG y grows downward).
// +t goes right and slightly down, +Re up-right (into the scene), +Im straight up.
export const AX_T: readonly [number, number] = [150, 28];
export const AX_RE: readonly [number, number] = [52, -40];
export const AX_IM: readonly [number, number] = [0, -95];
export const ORIGIN: readonly [number, number] = [150, 200];

export interface Sample {
  t: number;
  re: number;
  im: number;
}

export function evalWave(
  t: number,
  omega: number,
  gamma: number,
): { re: number; im: number } {
  const env = Math.exp(-gamma * (t - T0) * (t - T0));
  return { re: env * Math.cos(omega * t), im: env * Math.sin(omega * t) };
}

export function sampleWave(
  omega: number,
  gamma: number,
  n: number = N_SAMPLES,
): Sample[] {
  const samples: Sample[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * T_MAX;
    const { re, im } = evalWave(t, omega, gamma);
    samples[i] = { t, re, im };
  }
  return samples;
}

export function project(t: number, re: number, im: number): [number, number] {
  return [
    ORIGIN[0] + t * AX_T[0] + re * AX_RE[0] + im * AX_IM[0],
    ORIGIN[1] + t * AX_T[1] + re * AX_RE[1] + im * AX_IM[1],
  ];
}

export interface ViewPath {
  d: string;
  cum: Float64Array;
  total: number;
}

// Polyline path + exact cumulative arc length (measured on the same rounded
// coords that go into `d`, so it always agrees with the rendered path — no
// getTotalLength() needed).
export function buildViewPath(
  pts: ReadonlyArray<readonly [number, number]>,
): ViewPath {
  const cum = new Float64Array(pts.length);
  let d = "";
  let total = 0;
  let px = 0;
  let py = 0;
  for (let i = 0; i < pts.length; i++) {
    const x = Math.round(pts[i][0] * 100) / 100;
    const y = Math.round(pts[i][1] * 100) / 100;
    d += `${i === 0 ? "M" : "L"}${x} ${y}`;
    if (i > 0) total += Math.hypot(x - px, y - py);
    cum[i] = total;
    px = x;
    py = y;
  }
  return { d, cum, total };
}

// Arc length at fraction u ∈ [0, 1] of the sample range (u is linear in t;
// the spiral's arc length is not, hence the lookup).
export function lengthAt(vp: ViewPath, u: number): number {
  const n = vp.cum.length;
  if (n === 0) return 0;
  const idx = Math.min(Math.max(u, 0), 1) * (n - 1);
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, n - 1);
  return vp.cum[i0] + (vp.cum[i1] - vp.cum[i0]) * (idx - i0);
}
