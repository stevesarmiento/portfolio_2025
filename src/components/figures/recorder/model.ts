// The recorder's truth: six sine series, each term one spinning disc, and
// the sum the pen writes on the paper. Pure module.

export interface Term {
  a: number;
  f: number;
  p?: number;
}

export interface Preset {
  key: string;
  name: string;
  terms: Term[];
  /** Domain of x traced before the paper rewinds. */
  xMax: number;
  /** x-units per second. */
  speed: number;
  formula: string;
}

const series = (count: number, term: (k: number) => Term) => Array.from({ length: count }, (_, k) => term(k));

export const PRESETS: Preset[] = [
  { key: "spikes", name: "spikes", terms: series(13, (k) => ({ a: 5 / (k + 1), f: 4 * k + 1 })), xMax: 4 * Math.PI, speed: 0.6, formula: "y = 5 Σ sin((4k+1)x)/(k+1), k = 0…12" },
  { key: "crests", name: "odd harmonics", terms: series(12, (i) => ({ a: 6 / (2 * (i + 1) + 1), f: 2 * (i + 1) + 1 })), xMax: 4 * Math.PI, speed: 0.6, formula: "y = 6 Σ sin((2k+1)x)/(2k+1), k = 1…12" },
  { key: "square", name: "square wave", terms: series(7, (k) => ({ a: 2 / (2 * k + 1), f: 2 * k + 1 })), xMax: 6 * Math.PI, speed: 0.9, formula: "y = Σ 2 sin((2k+1)x)/(2k+1), k = 0…6" },
  { key: "beats", name: "beats", terms: [{ a: 15, f: 1, p: -30 }, { a: 15, f: 0.9, p: -27 }], xMax: 20 * Math.PI, speed: 4.5, formula: "y = 15(sin(x−30) + sin(0.9(x−30)))" },
  { key: "battlements", name: "battlements", terms: [{ a: 5, f: 1 }, { a: -1, f: 5 }], xMax: 4 * Math.PI, speed: 0.6, formula: "y = 5 sin x − sin 5x" },
  { key: "sawtooth", name: "soft sawtooth", terms: series(7, (i) => ({ a: 1.5 / Math.sqrt(i + 1), f: i + 1 })), xMax: 6 * Math.PI, speed: 0.9, formula: "y = Σ 1.5 sin(nx)/√n, n = 1…7" },
];

export const MAX_TERMS = Math.max(...PRESETS.map((p) => p.terms.length));

export function evalSeries(x: number, terms: readonly Term[], count: number): number {
  let y = 0;
  const top = Math.min(count, terms.length);
  for (let k = 0; k < top; k++) y += terms[k].a * Math.sin(terms[k].f * x + (terms[k].p ?? 0));
  return y;
}

export interface Link {
  cx: number;
  cy: number;
  r: number;
  angle: number;
  tx: number;
  ty: number;
}

/**
 * The chain of circles at x, in wave units: the first circle at the origin,
 * each next one on the previous tip. A negative amplitude is a π phase flip,
 * so the tips' y-sum is exactly the series value.
 */
export function chainAt(x: number, terms: readonly Term[], count: number): { links: Link[]; tip: [number, number] } {
  const links: Link[] = [];
  let px = 0;
  let py = 0;
  const top = Math.min(count, terms.length);
  for (let k = 0; k < top; k++) {
    const { a, f, p = 0 } = terms[k];
    const r = Math.abs(a);
    const angle = f * x + p + (a < 0 ? Math.PI : 0);
    const tx = px + r * Math.cos(angle);
    const ty = py + r * Math.sin(angle);
    links.push({ cx: px, cy: py, r, angle, tx, ty });
    px = tx;
    py = ty;
  }
  return { links, tip: [px, py] };
}

/** World units per wave unit so both the wave and the chain's reach fit `amp`. */
export function scaleOf(preset: Preset, count: number, amp: number, samples = 600): number {
  let maxAbs = 0;
  for (let i = 0; i < samples; i++) maxAbs = Math.max(maxAbs, Math.abs(evalSeries((i / (samples - 1)) * preset.xMax, preset.terms, count)));
  const sumAmp = preset.terms.slice(0, count).reduce((s, t) => s + Math.abs(t.a), 0);
  return Math.min(amp / Math.max(maxAbs, 1e-6), amp / Math.max(sumAmp, 1e-6), 2.6);
}

export const readoutOf = (preset: Preset, count: number, x: number) => `${preset.name} · ${count} term${count === 1 ? "" : "s"} · x ${(x / Math.PI).toFixed(1)}π`;
