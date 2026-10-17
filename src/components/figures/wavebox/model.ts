// The wave box's truth: the complex Gaussian wave packet
//   f(t) = e^(−γ(t−t₀)²) · e^(iωt)
// from the existing pure wave module.

import { T0, T_MAX, evalWave } from "./wave-math";

export { T0, T_MAX, evalWave };

export const OMEGA_RANGE: [number, number] = [6, 30];
export const GAMMA_RANGE: [number, number] = [0.6, 8];
export const OMEGA_DEFAULT = 18;
export const GAMMA_DEFAULT = 3.5;
export const SAMPLES = 480;
/** t-units per second of the sweep. */
export const SWEEP = 0.55;

export interface Sample {
  t: number;
  re: number;
  im: number;
}

export function sampleWave(omega: number, gamma: number, n = SAMPLES): Sample[] {
  const out: Sample[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * T_MAX;
    const { re, im } = evalWave(t, omega, gamma);
    out[i] = { t, re, im };
  }
  return out;
}

const signed = (v: number) => `${v < 0 ? "−" : "+"} ${Math.abs(v).toFixed(2)}`;

export function readoutOf(t: number, omega: number, gamma: number) {
  const { re, im } = evalWave(t, omega, gamma);
  return `t ${t.toFixed(2)} · f = ${re < 0 ? "−" : ""}${Math.abs(re).toFixed(2)} ${signed(im)}i`;
}

export const magnitudeOf = (t: number, omega: number, gamma: number) => {
  const { re, im } = evalWave(t, omega, gamma);
  return Math.hypot(re, im);
};
