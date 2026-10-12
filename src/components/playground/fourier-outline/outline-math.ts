// Fourier analysis of a closed outline. Pure module — no React, no DOM.
//
// A closed curve sampled at n points p_i = (x_i, y_i), i = 0..n−1, is read as
// z_i = x_i + i·y_i at t_i = 2πi/n. Its DFT gives z(t) ≈ Σ c_k e^{ikt}: one
// spinning circle per k. The same samples also give two real series, one per
// axis: x(t) ≈ a₀ + Σ (a_k cos kt + b_k sin kt), likewise for y.

export type Pt = readonly [number, number];

/** One complex term c·e^{ikt}, with c = amp·e^{i·phase}. */
export interface Coef {
  k: number;
  re: number;
  im: number;
  amp: number;
  phase: number;
}

/** One real term a cos kt + b sin kt = amp·cos(kt − phase). */
export interface RealTerm {
  k: number;
  amp: number;
  phase: number;
}

export interface RealSeries {
  mean: number;
  terms: RealTerm[]; // k = 1..M in harmonic order
}

/** Resample a closed polyline to n points spaced uniformly by arc length. */
export function resampleClosed(poly: readonly Pt[], n: number): Pt[] {
  const m = poly.length;
  const cum = new Float64Array(m + 1);
  for (let i = 0; i < m; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % m];
    cum[i + 1] = cum[i] + Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  const total = cum[m];
  const out: Pt[] = new Array(n);
  let seg = 0;
  for (let i = 0; i < n; i++) {
    const s = (i / n) * total;
    while (seg < m - 1 && cum[seg + 1] < s) seg++;
    const a = poly[seg];
    const b = poly[(seg + 1) % m];
    const len = cum[seg + 1] - cum[seg];
    const u = len > 0 ? (s - cum[seg]) / len : 0;
    out[i] = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  }
  return out;
}

/** Translate so the bounding box is centred on the origin, scale so height = 1. */
export function normalize(pts: readonly Pt[]): {
  pts: Pt[];
  width: number;
  /** Bounding-box centre in the input coordinates. */
  center: Pt;
  /** Bounding-box height in the input coordinates. */
  height: number;
} {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const h = maxY - minY || 1;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return {
    pts: pts.map(([x, y]) => [(x - cx) / h, (y - cy) / h] as const),
    width: (maxX - minX) / h,
    center: [cx, cy],
    height: h,
  };
}

function trigTable(n: number): { cos: Float64Array; sin: Float64Array } {
  const cos = new Float64Array(n);
  const sin = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    cos[j] = Math.cos((2 * Math.PI * j) / n);
    sin[j] = Math.sin((2 * Math.PI * j) / n);
  }
  return { cos, sin };
}

/**
 * Complex DFT of the outline, k ∈ [−n/2, n/2). Returned sorted by |c_k|
 * descending so the first N entries are the N biggest circles. The k = 0 term
 * (the centroid) is included; callers usually peel it off as the chain origin.
 */
export function dft(pts: readonly Pt[]): Coef[] {
  const n = pts.length;
  const { cos, sin } = trigTable(n);
  const half = Math.floor(n / 2);
  const out: Coef[] = [];
  for (let k = -half; k < n - half; k++) {
    let re = 0;
    let im = 0;
    for (let i = 0; i < n; i++) {
      // e^{−2πi·k·i/n}
      const j = (((k * i) % n) + n) % n;
      const c = cos[j];
      const s = -sin[j];
      re += pts[i][0] * c - pts[i][1] * s;
      im += pts[i][0] * s + pts[i][1] * c;
    }
    re /= n;
    im /= n;
    out.push({ k, re, im, amp: Math.hypot(re, im), phase: Math.atan2(im, re) });
  }
  out.sort((p, q) => q.amp - p.amp);
  return out;
}

/** Real Fourier series of one coordinate, harmonics 1..maxK. */
export function realSeries(
  pts: readonly Pt[],
  axis: 0 | 1,
  maxK: number,
): RealSeries {
  const n = pts.length;
  const { cos, sin } = trigTable(n);
  let mean = 0;
  for (let i = 0; i < n; i++) mean += pts[i][axis];
  mean /= n;
  const terms: RealTerm[] = [];
  const top = Math.min(maxK, Math.floor(n / 2) - 1);
  for (let k = 1; k <= top; k++) {
    let a = 0;
    let b = 0;
    for (let i = 0; i < n; i++) {
      const j = (k * i) % n;
      a += pts[i][axis] * cos[j];
      b += pts[i][axis] * sin[j];
    }
    a *= 2 / n;
    b *= 2 / n;
    terms.push({ k, amp: Math.hypot(a, b), phase: Math.atan2(b, a) });
  }
  return { mean, terms };
}

/** z_N(t) = Σ_{j<count} c_j e^{i k_j t} over the given (already sorted) coefficients. */
export function evalComplex(coefs: readonly Coef[], count: number, t: number): [number, number] {
  let x = 0;
  let y = 0;
  for (let j = 0; j < count; j++) {
    const { k, amp, phase } = coefs[j];
    const ang = k * t + phase;
    x += amp * Math.cos(ang);
    y += amp * Math.sin(ang);
  }
  return [x, y];
}

/** mean + Σ_{k≤count} amp_k cos(kt − phase_k). */
export function evalReal(series: RealSeries, count: number, t: number): number {
  let v = series.mean;
  const top = Math.min(count, series.terms.length);
  for (let j = 0; j < top; j++) {
    const { k, amp, phase } = series.terms[j];
    v += amp * Math.cos(k * t - phase);
  }
  return v;
}

/**
 * Harmonic conjugate partner of evalReal: Σ amp_k sin(kt − phase_k). Together
 * they give the chain tip's full 2-D position, which is what bounds its reach.
 */
export function evalRealConjugate(series: RealSeries, count: number, t: number): number {
  let v = 0;
  const top = Math.min(count, series.terms.length);
  for (let j = 0; j < top; j++) {
    const { k, amp, phase } = series.terms[j];
    v += amp * Math.sin(k * t - phase);
  }
  return v;
}

/** Largest pointwise gap between the reconstruction and the samples, as % of height. */
export function maxErrorPct(
  pts: readonly Pt[],
  recon: readonly Pt[],
): number {
  let worst = 0;
  for (let i = 0; i < pts.length; i++) {
    const d = Math.hypot(recon[i][0] - pts[i][0], recon[i][1] - pts[i][1]);
    if (d > worst) worst = d;
  }
  return worst * 100;
}
